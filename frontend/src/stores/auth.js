import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

/**
 * Auth Store — Mengelola state autentikasi
 * - Login, Register, Logout
 * - JWT token persistence via localStorage
 * - Role-based getters (isOwner, isRenter)
 */
export const useAuthStore = defineStore('auth', () => {
  // === State ===
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)

  // === Getters ===
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isOwner = computed(() => user.value?.role === 'owner')
  const isRenter = computed(() => user.value?.role === 'renter')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name || '')
  const userRole = computed(() => user.value?.role || '')

  // === Actions ===

  /**
   * Restore session dari localStorage saat app dimuat
   */
  function initAuth() {
    const savedToken = localStorage.getItem('ecoshare_token')
    const savedUser = localStorage.getItem('ecoshare_user')
    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)
      } catch {
        logout()
      }
    }
  }

  /**
   * Login user via API
   */
  async function login(email, password) {
    loading.value = true
    try {
      const res = await api.post('/auth/login', { email, password })
      const { user: userData, token: jwtToken } = res.data

      user.value = userData
      token.value = jwtToken

      // Persist to localStorage
      localStorage.setItem('ecoshare_token', jwtToken)
      localStorage.setItem('ecoshare_user', JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      return { success: false, message: error.message || 'Login gagal.' }
    } finally {
      loading.value = false
    }
  }

  /**
   * Register user via API
   */
  async function register(name, email, password, role) {
    loading.value = true
    try {
      await api.post('/auth/register', { name, email, password, role })
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message || 'Registrasi gagal.' }
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout — clear state & localStorage
   */
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('ecoshare_token')
    localStorage.removeItem('ecoshare_user')
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isOwner,
    isRenter,
    isAdmin,
    userName,
    userRole,
    initAuth,
    login,
    register,
    logout
  }
})
