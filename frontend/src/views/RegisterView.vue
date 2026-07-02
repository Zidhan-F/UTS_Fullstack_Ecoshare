<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('renter')
const formError = ref('')

async function handleRegister() {
  formError.value = ''

  if (!name.value || !email.value || !password.value || !role.value) {
    formError.value = 'Harap lengkapi semua field.'
    return
  }

  if (password.value.length < 6) {
    formError.value = 'Password minimal 6 karakter.'
    return
  }

  const result = await authStore.register(name.value, email.value, password.value, role.value)

  if (result.success) {
    toast.show('Registrasi berhasil! Silakan login.', 'success')
    router.push('/login')
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
        <p class="auth-brand-tagline">Bergabung dengan Platform Penyewaan Terpercaya</p>
      </div>

      <!-- Register Form -->
      <form class="auth-form" @submit.prevent="handleRegister" id="register-form">
        <h2 class="auth-title">Buat Akun Baru</h2>

        <div v-if="formError" class="alert alert-error animate-fade-in">
          {{ formError }}
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-name">Nama Lengkap</label>
          <input
            v-model="name"
            type="text"
            class="form-input"
            id="reg-name"
            placeholder="Masukkan nama lengkap"
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-email">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-input"
            id="reg-email"
            placeholder="nama@email.com"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            id="reg-password"
            placeholder="Minimal 6 karakter"
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Pilih Role</label>
          <div class="role-selector">
            <label
              class="role-option"
              :class="{ 'role-option-active': role === 'owner' }"
              id="role-owner"
            >
              <input type="radio" v-model="role" value="owner" class="role-radio" />
              <div class="role-content">
                <span class="role-label">Owner</span>
              </div>
            </label>
            <label
              class="role-option"
              :class="{ 'role-option-active': role === 'renter' }"
              id="role-renter"
            >
              <input type="radio" v-model="role" value="renter" class="role-radio" />
              <div class="role-content">
                <span class="role-label">Renter</span>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-lg btn-full"
          :disabled="authStore.loading"
          id="btn-register"
        >
          <span v-if="authStore.loading" class="btn-spinner"></span>
          {{ authStore.loading ? 'Memproses...' : 'Daftar Sekarang' }}
        </button>
      </form>

      <!-- Footer -->
      <div class="auth-footer">
        <p>Sudah punya akun? <router-link to="/login" id="link-login">Masuk di sini</router-link></p>
      </div>
    </div>

    <!-- Decorative -->
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

/* Role Selector */
.role-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.role-option {
  cursor: pointer;
  position: relative;
}

.role-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.role-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--color-bg-tertiary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  text-align: center;
}

.role-option:hover .role-content {
  border-color: var(--color-border-hover);
}

.role-option-active .role-content {
  border-color: var(--color-accent);
  background: var(--color-accent-glow);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
}

.role-option-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.role-option-disabled:hover .role-content {
  border-color: var(--color-border);
}

.role-option-disabled .role-content {
  background: var(--color-bg-primary);
  border-style: dashed;
}

.role-icon {
  font-size: 2rem;
}

.role-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  text-transform: capitalize;
}

.role-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: 1.3;
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

/* Decorative */
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
  .role-selector {
    grid-template-columns: 1fr;
  }
}
</style>
