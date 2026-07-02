<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToastStore()

const email = ref('')
const password = ref('')
const formError = ref('')

async function handleLogin() {
  formError.value = ''

  if (!email.value || !password.value) {
    formError.value = 'Harap lengkapi email dan password.'
    return
  }

  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    toast.show(`Selamat datang, ${authStore.userName}! 👋`, 'success')
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else {
    formError.value = result.message
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container animate-fade-in-up">
      <!-- Brand Header -->
      <div class="auth-brand">
        <span class="auth-brand-icon">♻️</span>
        <h1 class="auth-brand-name">Eco-Share</h1>
        <p class="auth-brand-tagline">Platform Penyewaan Elektronik Bekas</p>
      </div>

      <!-- Login Form -->
      <form class="auth-form" @submit.prevent="handleLogin" id="login-form">
        <h2 class="auth-title">Masuk ke Akun Anda</h2>

        <div v-if="formError" class="alert alert-error animate-fade-in">
          <span class="alert-icon">❌</span>
          {{ formError }}
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-input"
            id="email"
            placeholder="nama@email.com"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            id="password"
            placeholder="Masukkan password"
            autocomplete="current-password"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-lg btn-full"
          :disabled="authStore.loading"
          id="btn-login"
        >
          <span v-if="authStore.loading" class="btn-spinner"></span>
          {{ authStore.loading ? 'Memproses...' : '🔐 Masuk' }}
        </button>
      </form>

      <!-- Footer -->
      <div class="auth-footer">
        <p>Belum punya akun? <router-link to="/register" id="link-register">Daftar sekarang</router-link></p>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="auth-decoration">
      <div class="deco-circle deco-circle-1"></div>
      <div class="deco-circle deco-circle-2"></div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  z-index: 1;
}

.auth-brand {
  text-align: center;
  margin-bottom: var(--space-8);
}

.auth-brand-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-3);
}

.auth-brand-name {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-extrabold);
  background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-2);
}

.auth-brand-tagline {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.auth-form {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  backdrop-filter: blur(10px);
}

.auth-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  text-align: center;
  margin-bottom: var(--space-6);
  color: var(--color-text-primary);
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

.auth-footer {
  text-align: center;
  margin-top: var(--space-6);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.auth-footer a {
  font-weight: var(--font-weight-semibold);
}

/* Decorative Circles */
.auth-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
}

.deco-circle-1 {
  width: 500px;
  height: 500px;
  background: var(--color-accent);
  top: -200px;
  right: -150px;
}

.deco-circle-2 {
  width: 400px;
  height: 400px;
  background: var(--color-info);
  bottom: -200px;
  left: -100px;
}

@media (max-width: 480px) {
  .auth-form {
    padding: var(--space-6);
  }
}
</style>
