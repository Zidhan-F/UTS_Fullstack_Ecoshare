<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/axios'
import ItemCard from '@/components/ItemCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()
const items = ref([])
const loading = ref(true)

const showConfirmModal = ref(false)
const itemIdToDelete = ref(null)
const deleting = ref(false)

onMounted(async () => {
  await fetchItems()
})

async function fetchItems() {
  loading.value = true
  try {
    const res = await api.get('/items')
    items.value = res.data
  } catch {
    // Error handled by interceptor
  } finally {
    loading.value = false
  }
}

function handleRent(item) {
  router.push(`/rentals/create/${item.id}`)
}

function triggerDelete(itemId) {
  itemIdToDelete.value = itemId
  showConfirmModal.value = true
}

async function confirmDelete() {
  if (!itemIdToDelete.value) return

  deleting.value = true
  try {
    await api.delete(`/items/${itemIdToDelete.value}`)
    toast.show('Barang berhasil dihapus.', 'success')
    showConfirmModal.value = false
    itemIdToDelete.value = null
    await fetchItems()
  } catch {
    // Error handled by interceptor
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="items-page">
      <!-- Header -->
      <div class="page-header animate-fade-in-up">
        <div class="header-content">
          <h1 class="page-title">Daftar Barang</h1>
          <p class="page-subtitle">Barang elektronik yang tersedia untuk disewa</p>
        </div>
        <router-link
          v-if="authStore.isOwner"
          to="/items/create"
          class="btn btn-primary"
          id="btn-add-item"
        >
          Tambah Barang
        </router-link>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" />

      <!-- Items Grid -->
      <div v-else-if="items.length > 0" class="grid grid-3 stagger-children">
        <ItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @rent="handleRent"
          @delete="triggerDelete"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state animate-fade-in">
        <h3 class="empty-state-title">Belum Ada Barang</h3>
        <p class="empty-state-text">
          {{ authStore.isOwner
            ? 'Mulai sewakan barang elektronik Anda.'
            : 'Belum ada barang yang tersedia saat ini.'
          }}
        </p>
        <router-link
          v-if="authStore.isOwner"
          to="/items/create"
          class="btn btn-primary"
        >
          Tambah Barang Pertama
        </router-link>
      </div>
    </div>

    <!-- Custom Delete Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay animate-fade-in" @click.self="showConfirmModal = false">
      <div class="modal-card card animate-scale-in">
        <h3 class="modal-title">Konfirmasi Hapus</h3>
        <p class="modal-message">Apakah Anda yakin ingin menghapus barang ini secara permanen?</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" :disabled="deleting" @click="showConfirmModal = false">
            Batal
          </button>
          <button class="btn btn-danger" :disabled="deleting" @click="confirmDelete">
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.items-page {
  padding: var(--space-8) 0;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 90%;
  max-width: 400px;
  padding: var(--space-6);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  text-align: center;
  border-radius: var(--radius-xl);
}

.modal-card:hover {
  transform: none; /* disable hover scale for modal card */
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.modal-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}

.modal-actions .btn {
  flex: 1;
  max-width: 120px;
}

/* Modal animation support */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease forwards;
}

@media (max-width: 480px) {
  .page-header {
    flex-direction: column;
  }
  .page-header .btn {
    width: 100%;
  }
}
</style>
