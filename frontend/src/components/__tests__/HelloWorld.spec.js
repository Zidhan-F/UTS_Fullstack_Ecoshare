/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true
})

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should start with unauthenticated state', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
  })

  it('should correctly identify owner role', () => {
    const store = useAuthStore()
    store.user = { id: 1, name: 'Test Owner', email: 'owner@test.com', role: 'owner' }
    store.token = 'test-token'

    expect(store.isAuthenticated).toBe(true)
    expect(store.isOwner).toBe(true)
    expect(store.isRenter).toBe(false)
    expect(store.userName).toBe('Test Owner')
    expect(store.userRole).toBe('owner')
  })

  it('should correctly identify renter role', () => {
    const store = useAuthStore()
    store.user = { id: 2, name: 'Test Renter', email: 'renter@test.com', role: 'renter' }
    store.token = 'test-token'

    expect(store.isAuthenticated).toBe(true)
    expect(store.isOwner).toBe(false)
    expect(store.isRenter).toBe(true)
    expect(store.isAdmin).toBe(false)
  })

  it('should correctly identify admin role', () => {
    const store = useAuthStore()
    store.user = { id: 3, name: 'Test Admin', email: 'admin@test.com', role: 'admin' }
    store.token = 'test-token'

    expect(store.isAuthenticated).toBe(true)
    expect(store.isOwner).toBe(false)
    expect(store.isRenter).toBe(false)
    expect(store.isAdmin).toBe(true)
  })

  it('should clear state on logout', () => {
    const store = useAuthStore()
    store.user = { id: 1, name: 'Test', role: 'owner' }
    store.token = 'test-token'

    store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('ecoshare_token')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('ecoshare_user')
  })

  it('should restore session from localStorage', () => {
    const userData = { id: 1, name: 'Saved User', email: 'saved@test.com', role: 'renter' }
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'ecoshare_token') return 'saved-token'
      if (key === 'ecoshare_user') return JSON.stringify(userData)
      return null
    })

    const store = useAuthStore()
    store.initAuth()

    expect(store.isAuthenticated).toBe(true)
    expect(store.user.name).toBe('Saved User')
    expect(store.token).toBe('saved-token')
    expect(store.isRenter).toBe(true)
  })
})

describe('Toast Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should start with empty toasts', () => {
    const store = useToastStore()
    expect(store.toasts).toHaveLength(0)
  })

  it('should add a toast notification', () => {
    const store = useToastStore()
    store.show('Test message', 'success')

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].message).toBe('Test message')
    expect(store.toasts[0].type).toBe('success')
  })

  it('should remove a toast notification', () => {
    const store = useToastStore()
    store.show('Toast 1', 'info')
    store.show('Toast 2', 'error')

    expect(store.toasts).toHaveLength(2)

    const id = store.toasts[0].id
    store.remove(id)

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].message).toBe('Toast 2')
  })
})
