import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Toast Store — Unified notification system
 * Digunakan oleh Axios interceptor dan komponen untuk menampilkan pesan
 */
export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let toastId = 0

  /**
   * Tampilkan toast notification
   * @param {string} message - Pesan yang ditampilkan
   * @param {'success'|'error'|'warning'|'info'} type - Tipe toast
   * @param {number} duration - Durasi dalam ms (default: 4000)
   */
  function show(message, type = 'info', duration = 4000) {
    const id = ++toastId
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      remove(id)
    }, duration)
  }

  /**
   * Hapus toast berdasarkan id
   */
  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    show,
    remove
  }
})
