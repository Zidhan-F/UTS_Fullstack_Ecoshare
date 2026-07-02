<script setup>
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/AppNavbar.vue'
import AppToast from '@/components/AppToast.vue'

const authStore = useAuthStore()
</script>

<template>
  <div class="app-wrapper">
    <AppNavbar v-if="authStore.isAuthenticated" />
    <main class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppToast />
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
