<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/axios'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const loading = ref(true)
const stats = ref({
  totalItems: 0,
  totalRentals: 0,
  activeRentals: 0
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Selamat Pagi'
  if (hour < 17) return 'Selamat Siang'
  return 'Selamat Malam'
})

onMounted(async () => {
  try {
    // Ambil data items untuk statistik
    const itemsRes = await api.get('/items')
    stats.value.totalItems = itemsRes.data.length

    // Ambil data rentals
    try {
      const rentalsRes = await api.get('/rentals')
      const rentals = rentalsRes.data
      stats.value.totalRentals = rentals.length
      stats.value.activeRentals = rentals.filter(r => r.status === 'active').length
    } catch {
      // Endpoint rentals mungkin belum tersedia
      stats.value.totalRentals = 0
      stats.value.activeRentals = 0
    }
  } catch {
    // Silently fail
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container">
    <div class="dashboard">
      <!-- Welcome Section -->
      <div class="welcome-section animate-fade-in-up">
        <div class="welcome-text">
          <p class="welcome-greeting">{{ greeting }}</p>
          <h1 class="welcome-name">{{ authStore.userName }}</h1>
          <p class="welcome-role">
            Anda login sebagai
            <span class="badge" :class="authStore.isOwner ? 'badge-info' : 'badge-success'">
              {{ authStore.userRole }}
            </span>
          </p>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <!-- Stats Cards -->
        <div class="stats-grid stagger-children">
          <div class="stat-card card animate-fade-in-up">
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalItems }}</span>
              <span class="stat-label">Barang Tersedia</span>
            </div>
          </div>
          <div class="stat-card card animate-fade-in-up">
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalRentals }}</span>
              <span class="stat-label">Total Penyewaan</span>
            </div>
          </div>
          <div class="stat-card card animate-fade-in-up">
            <div class="stat-info">
              <span class="stat-value">{{ stats.activeRentals }}</span>
              <span class="stat-label">Sedang Aktif</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions animate-fade-in-up">
          <h2 class="section-title">Aksi Cepat</h2>
          <div class="actions-grid">
            <!-- Owner Actions -->
            <template v-if="authStore.isOwner">
              <router-link to="/items/create" class="action-card" id="action-create-item">
                <span class="action-title">Tambah Barang</span>
                <span class="action-desc">Sewakan barang elektronik Anda</span>
              </router-link>
              <router-link to="/items" class="action-card" id="action-view-items">
                <span class="action-title">Lihat Barang</span>
                <span class="action-desc">Kelola daftar barang Anda</span>
              </router-link>
              <router-link to="/rentals" class="action-card" id="action-manage-rentals">
                <span class="action-title">Kelola Penyewaan</span>
                <span class="action-desc">Konfirmasi pengembalian barang</span>
              </router-link>
            </template>

            <!-- Renter Actions -->
            <template v-if="authStore.isRenter">
              <router-link to="/items" class="action-card" id="action-browse-items">
                <span class="action-title">Cari Barang</span>
                <span class="action-desc">Temukan barang yang Anda butuhkan</span>
              </router-link>
              <router-link to="/rentals" class="action-card" id="action-my-rentals">
                <span class="action-title">Penyewaan Saya</span>
                <span class="action-desc">Lihat riwayat penyewaan Anda</span>
              </router-link>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--space-8) 0;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-8);
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-tertiary));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-8);
  overflow: hidden;
  position: relative;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: linear-gradient(135deg, transparent, var(--color-accent-glow));
  pointer-events: none;
}

.welcome-greeting {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}

.welcome-name {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.welcome-role {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.welcome-decoration {
  position: relative;
  z-index: 1;
}

.welcome-emoji {
  font-size: 4rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.stat-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-icon-items { background: rgba(59, 130, 246, 0.15); }
.stat-icon-rentals { background: rgba(245, 158, 11, 0.15); }
.stat-icon-active { background: rgba(16, 185, 129, 0.15); }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

/* Quick Actions */
.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-5);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-5);
}

.action-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  text-decoration: none;
  transition: all var(--transition-base);
  cursor: pointer;
}

.action-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-glow);
  transform: translateY(-3px);
}

.action-icon {
  font-size: 2rem;
}

.action-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.action-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .welcome-section {
    padding: var(--space-6);
  }

  .welcome-name {
    font-size: var(--font-size-2xl);
  }

  .welcome-emoji {
    font-size: 3rem;
  }
}
</style>
