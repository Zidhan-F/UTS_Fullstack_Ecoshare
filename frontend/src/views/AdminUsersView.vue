<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/axios'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const toast = useToastStore()
const authStore = useAuthStore()
const users = ref([])
const loading = ref(true)
const updatingUserId = ref(null)

onMounted(async () => {
  await fetchUsers()
})

async function fetchUsers() {
  loading.value = true
  try {
    const res = await api.get('/admin/users')
    users.value = res.data
  } catch {
    // Handled by axios interceptor
  } finally {
    loading.value = false
  }
}

async function handleRoleChange(user, event) {
  const newRole = event.target.value
  updatingUserId.value = user.id
  
  try {
    await api.put(`/admin/users/${user.id}/role`, { role: newRole })
    toast.show(`Role ${user.name} berhasil diubah menjadi ${newRole}`, 'success')
    // Update local state
    user.role = newRole
  } catch (error) {
    // If it fails, restore original value
    event.target.value = user.role
  } finally {
    updatingUserId.value = null
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="container">
    <div class="admin-users-page">
      <!-- Header -->
      <div class="page-header animate-fade-in-up">
        <div class="header-content">
          <h1 class="page-title">Kelola User</h1>
          <p class="page-subtitle">Kelola peran pengguna dan otorisasi sistem</p>
        </div>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" />

      <!-- User List Card -->
      <div v-else class="card animate-fade-in" id="users-management-card">
        <div class="table-responsive">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Tanggal Terdaftar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" :class="{ 'is-current-user': user.id === authStore.user?.id }">
                <td>#{{ user.id }}</td>
                <td>
                  <div class="user-cell-name">
                    {{ user.name }}
                    <span v-if="user.id === authStore.user?.id" class="badge badge-info ms-2">Anda</span>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" :class="{
                    'badge-danger': user.role === 'admin',
                    'badge-info': user.role === 'owner',
                    'badge-success': user.role === 'renter'
                  }">
                    {{ user.role }}
                  </span>
                </td>
                <td>{{ formatDate(user.created_at) }}</td>
                <td>
                  <div class="action-cell">
                    <select
                      :value="user.role"
                      @change="handleRoleChange(user, $event)"
                      :disabled="updatingUserId === user.id || user.id === authStore.user?.id"
                      class="form-select select-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                      <option value="renter">Renter</option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-users-page {
  padding: var(--space-8) 0;
}

.page-header {
  margin-bottom: var(--space-6);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.users-table th,
.users-table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  vertical-align: middle;
}

.users-table th {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
  border-bottom: 2px solid var(--color-border);
}

.users-table tr:hover {
  background: var(--color-bg-primary);
}

.is-current-user {
  background: var(--color-accent-glow) !important;
}

.user-cell-name {
  display: flex;
  align-items: center;
  font-weight: var(--font-weight-medium);
}

.ms-2 {
  margin-left: var(--space-2);
}

.form-select {
  width: 130px;
  padding: var(--space-1) var(--space-6) var(--space-1) var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: var(--font-size-xs);
  cursor: pointer;
  outline: none;
  transition: border-color var(--transition-base);
}

.form-select:focus {
  border-color: var(--color-accent);
}

.form-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-sm {
  height: 32px;
}
</style>
