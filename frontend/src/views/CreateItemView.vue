<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import api from '@/lib/axios'

const router = useRouter()
const toast = useToastStore()

const name = ref('')
const description = ref('')
const dailyPrice = ref('')
const loading = ref(false)
const formError = ref('')

function formatPreviewPrice(val) {
  const num = parseFloat(val)
  if (isNaN(num) || num <= 0) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num)
}

async function handleSubmit() {
  formError.value = ''

  if (!name.value || !dailyPrice.value) {
    formError.value = 'Nama barang dan harga sewa per hari wajib diisi.'
    return
  }

  const price = parseFloat(dailyPrice.value)
  if (isNaN(price) || price <= 0) {
    formError.value = 'Harga harus berupa angka positif.'
    return
  }

  loading.value = true
  try {
    await api.post('/items', {
      name: name.value,
      description: description.value,
      daily_price: price
    })
    toast.show('Barang berhasil ditambahkan!', 'success')
    router.push('/items')
  } catch {
    formError.value = 'Gagal menambahkan barang.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="create-item-page">
      <div class="page-header animate-fade-in-up">
        <router-link to="/items" class="back-link" id="link-back-items">Kembali ke Daftar Barang</router-link>
        <h1 class="page-title">Tambah Barang Baru</h1>
        <p class="page-subtitle">Daftarkan barang elektronik untuk disewakan</p>
      </div>

      <div class="form-layout animate-fade-in-up">
        <form class="create-form card" @submit.prevent="handleSubmit" id="create-item-form">
          <div v-if="formError" class="alert alert-error animate-fade-in">
            {{ formError }}
          </div>

          <div class="form-group">
            <label class="form-label" for="item-name">Nama Barang *</label>
            <input
              v-model="name"
              type="text"
              class="form-input"
              id="item-name"
              placeholder="contoh: Kamera Canon EOS R5"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="item-desc">Deskripsi</label>
            <textarea
              v-model="description"
              class="form-textarea"
              id="item-desc"
              placeholder="Deskripsi detail tentang barang..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="item-price">Harga Sewa per Hari (IDR) *</label>
            <input
              v-model="dailyPrice"
              type="number"
              class="form-input"
              id="item-price"
              placeholder="contoh: 500000"
              min="1000"
              step="1000"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg btn-full"
            :disabled="loading"
            id="btn-submit-item"
          >
            <span v-if="loading" class="btn-spinner"></span>
            {{ loading ? 'Menyimpan...' : 'Simpan Barang' }}
          </button>
        </form>

        <!-- Preview Card -->
        <div class="preview-section">
          <h3 class="preview-title">Preview</h3>
          <div class="preview-card card">
            <h4 class="preview-name">{{ name || 'Nama Barang' }}</h4>
            <p class="preview-desc">{{ description || 'Deskripsi barang akan tampil di sini...' }}</p>
            <div class="preview-price">
              <span class="preview-price-value">{{ formatPreviewPrice(dailyPrice) }}</span>
              <span class="preview-price-period">/ hari</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-item-page {
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

.form-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-8);
  align-items: start;
}

.create-form {
  padding: var(--space-8);
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

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: var(--space-2);
}

/* Preview */
.preview-section {
  position: sticky;
  top: 80px;
}

.preview-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-4);
}

.preview-card {
  text-align: center;
  padding: var(--space-8) var(--space-6);
}

.preview-card:hover {
  transform: none;
}

.preview-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
}

.preview-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  word-break: break-word;
}

.preview-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-5);
  line-height: 1.5;
  word-break: break-word;
}

.preview-price {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.preview-price-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-light);
}

.preview-price-period {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .form-layout {
    grid-template-columns: 1fr;
  }
  .preview-section {
    position: static;
  }
}
</style>
