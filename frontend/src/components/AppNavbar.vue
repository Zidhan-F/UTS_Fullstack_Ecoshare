<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()
const mobileMenuOpen = ref(false)

function handleLogout() {
  authStore.logout()
  toast.show('Berhasil logout. Sampai jumpa!', 'success')
  router.push('/login')
  mobileMenuOpen.value = false
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar" id="main-navbar">
    <div class="navbar-inner container">
      <!-- Logo -->
      <router-link to="/dashboard" class="navbar-brand" @click="closeMobileMenu">
        <span class="brand-icon">♻️</span>
        <span class="brand-text">Eco-Share</span>
      </router-link>

      <!-- Desktop Navigation -->
      <div class="navbar-links" :class="{ 'is-open': mobileMenuOpen }">
        <router-link to="/dashboard" class="nav-link" active-class="nav-link-active" @click="closeMobileMenu">
          Dashboard
        </router-link>
        <router-link to="/items" class="nav-link" active-class="nav-link-active" @click="closeMobileMenu">
          Barang
        </router-link>
        <router-link v-if="authStore.isOwner || authStore.isAdmin" to="/items/create" class="nav-link" active-class="nav-link-active" @click="closeMobileMenu">
          Tambah Barang
        </router-link>
        <router-link to="/rentals" class="nav-link" active-class="nav-link-active" @click="closeMobileMenu">
          Penyewaan
        </router-link>
        <router-link v-if="authStore.isAdmin" to="/admin/users" class="nav-link" active-class="nav-link-active" @click="closeMobileMenu">
          Kelola User
        </router-link>
      </div>

      <!-- User Menu -->
      <div class="navbar-user">
        <div class="user-info">
          <span class="user-name">{{ authStore.userName }}</span>
          <span class="user-role badge" :class="authStore.isAdmin ? 'badge-danger' : authStore.isOwner ? 'badge-info' : 'badge-success'">
            {{ authStore.userRole }}
          </span>
        </div>
        <button class="btn btn-ghost btn-sm" @click="handleLogout" id="btn-logout">
          Logout
        </button>
      </div>

      <!-- Mobile Toggle -->
      <button class="navbar-toggle" @click="mobileMenuOpen = !mobileMenuOpen" id="btn-mobile-toggle">
        <span :class="{ 'toggle-active': mobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>

    <!-- Mobile Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>
  </nav>
</template>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: var(--space-6);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.brand-icon {
  font-size: 1.5rem;
}

.brand-text {
  background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-text-primary);
  background: rgba(0, 0, 0, 0.05);
}

.nav-link-active {
  color: var(--color-accent) !important;
  background: var(--color-accent-glow);
}

.nav-icon {
  font-size: 1rem;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.user-role {
  text-transform: capitalize;
}

.navbar-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  z-index: 110;
}

.navbar-toggle span span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text-primary);
  margin: 5px 0;
  transition: all var(--transition-base);
  border-radius: 2px;
}

.toggle-active span:nth-child(1) {
  transform: rotate(45deg) translate(4px, 6px);
}

.toggle-active span:nth-child(2) {
  opacity: 0;
}

.toggle-active span:nth-child(3) {
  transform: rotate(-45deg) translate(4px, -6px);
}

.mobile-overlay {
  display: none;
}

/* === Mobile Responsive === */
@media (max-width: 768px) {
  .navbar-toggle {
    display: block;
  }

  .navbar-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: var(--color-bg-secondary);
    flex-direction: column;
    align-items: flex-start;
    padding: 80px var(--space-6) var(--space-6);
    gap: var(--space-2);
    transition: right var(--transition-base);
    z-index: 105;
    border-left: 1px solid var(--color-border);
  }

  .navbar-links.is-open {
    right: 0;
  }

  .nav-link {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-base);
  }

  .navbar-user {
    display: none;
  }

  .navbar-links.is-open::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: var(--color-border);
    margin: var(--space-4) 0;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
}
</style>
