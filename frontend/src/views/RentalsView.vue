<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import api from '@/lib/axios'
import RentalCard from '@/components/RentalCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const toast = useToastStore()
const rentals = ref([])
const loading = ref(true)

onMounted(async () => {
  await fetchRentals()
})

async function fetchRentals() {
  loading.value = true
  try {
    const res = await api.get('/rentals')
    rentals.value = res.data
  } catch {
    // Error handled by interceptor
    rentals.value = []
  } finally {
    loading.value = false
  }
}

async function handleComplete(rentalId) {
  try {
    await api.post(`/rentals/${rentalId}/complete`)
    toast.show('Pengembalian barang berhasil dikonfirmasi!', 'success')
    await fetchRentals()
  } catch {
    // Error handled by interceptor
  }
}
</script>

<template>
  <div class="container">
    <div class="rentals-page">
      <!-- Header -->
      <div class="page-header animate-fade-in-up">
        <h1 class="page-title">{{ authStore.isOwner ? 'Kelola Penyewaan' : 'Penyewaan Saya' }}</h1>
        <p class="page-subtitle">
          {{ authStore.isOwner
            ? 'Daftar penyewaan barang milik Anda'
            : 'Riwayat penyewaan barang Anda'
          }}
        </p>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" />

      <!-- Rentals List -->
      <div v-else-if="rentals.length > 0" class="grid grid-2 stagger-children">
        <RentalCard
          v-for="rental in rentals"
          :key="rental.id"
          :rental="rental"
          :showCompleteBtn="authStore.isOwner"
          @complete="handleComplete"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state animate-fade-in">
        <h3 class="empty-state-title">Belum Ada Penyewaan</h3>
        <p class="empty-state-text">
          {{ authStore.isOwner
            ? 'Belum ada yang menyewa barang Anda.'
            : 'Anda belum melakukan penyewaan.'
          }}
        </p>
        <router-link
          v-if="authStore.isRenter"
          to="/items"
          class="btn btn-primary"
          id="btn-browse-items"
        >
          Cari Barang
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rentals-page {
  padding: var(--space-8) 0;
}
</style>
