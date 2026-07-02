<script setup>
defineProps({
  rental: {
    type: Object,
    required: true
  },
  showCompleteBtn: {
    type: Boolean,
    default: false
  }
})

defineEmits(['complete'])

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function getStatusBadge(status) {
  const map = {
    active: { class: 'badge-success', label: 'Aktif', dot: 'status-dot-active' },
    pending: { class: 'badge-warning', label: 'Pending', dot: 'status-dot-pending' },
    completed: { class: 'badge-info', label: 'Selesai', dot: 'status-dot-completed' },
    cancelled: { class: 'badge-danger', label: 'Dibatalkan', dot: '' }
  }
  return map[status] || { class: 'badge-neutral', label: status, dot: '' }
}
</script>

<template>
  <div class="rental-card card animate-fade-in-up" :id="`rental-card-${rental.id}`">
    <div class="rental-card-header">
      <div class="rental-info">
        <h4 class="rental-item-name">{{ rental.item_name || `Barang #${rental.item_id}` }}</h4>
        <span class="badge" :class="getStatusBadge(rental.status).class">
          <span v-if="getStatusBadge(rental.status).dot" class="status-dot" :class="getStatusBadge(rental.status).dot"></span>
          {{ getStatusBadge(rental.status).label }}
        </span>
      </div>
      <div class="rental-total">
        {{ formatPrice(rental.total_price) }}
      </div>
    </div>

    <div class="rental-card-body">
      <div class="rental-dates">
        <div class="date-item">
          <span class="date-label">Mulai</span>
          <span class="date-value">{{ formatDate(rental.start_date) }}</span>
        </div>
        <div class="date-separator">→</div>
        <div class="date-item">
          <span class="date-label">Selesai</span>
          <span class="date-value">{{ formatDate(rental.end_date) }}</span>
        </div>
      </div>

      <div v-if="rental.renter_name" class="rental-meta">
        <span class="meta-label">Penyewa:</span>
        <span class="meta-value">{{ rental.renter_name }}</span>
      </div>
    </div>

    <div v-if="showCompleteBtn && rental.status === 'active'" class="rental-card-footer">
      <button
        class="btn btn-primary btn-sm btn-full"
        @click="$emit('complete', rental.id)"
        :id="`btn-complete-${rental.id}`"
      >
        Konfirmasi Pengembalian
      </button>
    </div>
  </div>
</template>

<style scoped>
.rental-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.rental-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.rental-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.rental-item-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.rental-total {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-light);
  white-space: nowrap;
}

.rental-dates {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.date-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.date-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.date-separator {
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
}

.rental-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.meta-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.meta-value {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.rental-card-footer {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}
</style>
