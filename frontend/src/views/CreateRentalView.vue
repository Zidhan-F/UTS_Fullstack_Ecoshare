<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import api from '@/lib/axios'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const props = defineProps({
  itemId: {
    type: String,
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const item = ref(null)
const startDate = ref('')
const endDate = ref('')
const loading = ref(true)
const submitting = ref(false)
const formError = ref('')

// Set min date to today
const today = new Date().toISOString().split('T')[0]

// Kalkulasi otomatis
const rentalDays = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
})

const totalPrice = computed(() => {
  if (!item.value || rentalDays.value <= 0) return 0
  return rentalDays.value * parseFloat(item.value.daily_price)
})

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

onMounted(async () => {
  try {
    const res = await api.get('/items')
    item.value = res.data.find(i => i.id === parseInt(props.itemId))
    if (!item.value) {
      toast.show('Barang tidak ditemukan.', 'error')
      router.push('/items')
    }
  } catch {
    router.push('/items')
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  formError.value = ''

  if (!startDate.value || !endDate.value) {
    formError.value = 'Harap pilih tanggal mulai dan selesai.'
    return
  }

  if (rentalDays.value <= 0) {
    formError.value = 'Tanggal selesai harus setelah tanggal mulai.'
    return
  }

  submitting.value = true
  try {
    await api.post('/rentals', {
      item_id: parseInt(props.itemId),
      start_date: startDate.value,
      end_date: endDate.value
    })
    toast.show('Penyewaan berhasil dibuat!', 'success')
    router.push('/rentals')
  } catch {
    formError.value = 'Gagal membuat penyewaan.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="create-rental-page">
      <div class="page-header animate-fade-in-up">
        <router-link to="/items" class="back-link" id="link-back-items-rental">Kembali ke Daftar Barang</router-link>
        <h1 class="page-title">Sewa Barang</h1>
        <p class="page-subtitle">Lengkapi detail penyewaan di bawah ini</p>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="item" class="rental-layout animate-fade-in-up">
        <!-- Form -->
        <form class="rental-form card" @submit.prevent="handleSubmit" id="create-rental-form">
          <!-- Item Info -->
          <div class="selected-item">
            <div class="selected-item-info">
              <h3 class="selected-item-name">{{ item.name }}</h3>
              <p class="selected-item-price">{{ formatPrice(item.daily_price) }} / hari</p>
            </div>
          </div>

          <div v-if="formError" class="alert alert-error animate-fade-in">
            {{ formError }}
          </div>

          <div class="date-inputs">
            <div class="form-group">
              <label class="form-label" for="start-date">Tanggal Mulai</label>
              <input
                v-model="startDate"
                type="date"
                class="form-input"
                id="start-date"
                :min="today"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="end-date">Tanggal Selesai</label>
              <input
                v-model="endDate"
                type="date"
                class="form-input"
                id="end-date"
                :min="startDate || today"
              />
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg btn-full"
            :disabled="submitting || rentalDays <= 0"
            id="btn-submit-rental"
          >
            <span v-if="submitting" class="btn-spinner"></span>
            {{ submitting ? 'Memproses...' : 'Konfirmasi Penyewaan' }}
          </button>
        </form>

        <!-- Price Summary -->
        <div class="summary-section">
          <h3 class="summary-title">Ringkasan Biaya</h3>
          <div class="summary-card card">
            <div class="summary-card-inner">
              <div class="summary-row">
                <span class="summary-label">Harga per hari</span>
                <span class="summary-value">{{ formatPrice(item.daily_price) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Durasi sewa</span>
                <span class="summary-value">{{ rentalDays > 0 ? `${rentalDays} hari` : '-' }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row summary-total">
                <span class="summary-label">Total Biaya</span>
                <span class="summary-value">{{ totalPrice > 0 ? formatPrice(totalPrice) : '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-rental-page {
  padding: var(--space-8) 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-accent);
}

.rental-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-8);
  align-items: start;
}

.rental-form {
  padding: var(--space-8);
}

.selected-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
}

.selected-item-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-glow);
  border-radius: var(--radius-md);
}

.selected-item-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.selected-item-price {
  font-size: var(--font-size-sm);
  color: var(--color-accent-light);
}

.alert {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-5);
  font-size: var(--font-size-sm);
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.alert-icon {
  flex-shrink: 0;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: var(--space-2);
}

/* Summary */
.summary-section {
  position: sticky;
  top: 80px;
}

.summary-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-4);
}

.summary-card:hover {
  transform: none;
}

.summary-card-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.summary-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.summary-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-2) 0;
}

.summary-total .summary-label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.summary-total .summary-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-light);
}

@media (max-width: 768px) {
  .rental-layout {
    grid-template-columns: 1fr;
  }
  .date-inputs {
    grid-template-columns: 1fr;
  }
  .summary-section {
    position: static;
  }
}
</style>
