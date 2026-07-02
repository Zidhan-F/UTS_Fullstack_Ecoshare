import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ItemsView from '@/views/ItemsView.vue'
import CreateItemView from '@/views/CreateItemView.vue'
import RentalsView from '@/views/RentalsView.vue'
import CreateRentalView from '@/views/CreateRentalView.vue'
import AdminUsersView from '@/views/AdminUsersView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/items',
    name: 'Items',
    component: ItemsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/items/create',
    name: 'CreateItem',
    component: CreateItemView,
    meta: { requiresAuth: true, requiresRole: 'owner' }
  },
  {
    path: '/rentals',
    name: 'Rentals',
    component: RentalsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/rentals/create/:itemId',
    name: 'CreateRental',
    component: CreateRentalView,
    meta: { requiresAuth: true, requiresRole: 'renter' },
    props: true
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsersView,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// === Navigation Guard ===
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Route memerlukan autentikasi
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // Route hanya untuk guest (belum login)
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next('/dashboard')
  }

  // Route memerlukan role tertentu (Admin bisa mengakses semua role)
  if (to.meta.requiresRole) {
    const userRole = authStore.user?.role
    if (userRole !== to.meta.requiresRole && userRole !== 'admin') {
      return next('/dashboard')
    }
  }

  next()
})

export default router
