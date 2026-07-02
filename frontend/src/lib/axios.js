import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import router from '@/router'

/**
 * Axios instance terkonfigurasi untuk Eco-Share API
 * - Auto-inject JWT token dari auth store
 * - Unified error handling via response interceptor
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
})

// === Request Interceptor ===
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// === Response Interceptor ===
api.interceptors.response.use(
  (response) => {
    // API mengembalikan format { success: true, data: ... }
    return response.data
  },
  (error) => {
    const toast = useToastStore()

    // Network error (server unreachable)
    if (!error.response) {
      toast.show('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 'error')
      return Promise.reject(error)
    }

    const { status, data } = error.response
    const message = data?.error || 'Terjadi kesalahan yang tidak diketahui.'

    switch (status) {
      case 401:
        // Token expired atau invalid → auto-logout
        {
          const authStore = useAuthStore()
          if (authStore.isAuthenticated) {
            authStore.logout()
            toast.show('Sesi Anda telah berakhir. Silakan login kembali.', 'warning')
            router.push('/login')
          }
        }
        break
      case 403:
        toast.show(message || 'Akses ditolak. Anda tidak memiliki izin.', 'error')
        break
      case 404:
        toast.show(message || 'Data tidak ditemukan.', 'error')
        break
      case 400:
        toast.show(message, 'error')
        break
      case 500:
      default:
        toast.show('Terjadi kesalahan internal pada server.', 'error')
        break
    }

    return Promise.reject({ status, message, raw: error })
  }
)

export default api
