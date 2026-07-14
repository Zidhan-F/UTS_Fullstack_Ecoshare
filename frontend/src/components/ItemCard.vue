<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['rent', 'delete'])

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <div class="item-card card animate-fade-in-up" :id="`item-card-${item.id}`">
    <div class="item-card-header">
      <div class="item-price-tag">
        <span class="price-amount">{{ formatPrice(item.daily_price) }}</span>
        <span class="price-period">/ hari</span>
      </div>
    </div>

    <div class="item-card-body">
      <h3 class="item-name">{{ item.name }}</h3>
      <p class="item-desc">{{ item.description || 'Tidak ada deskripsi.' }}</p>
    </div>

    <div class="item-card-footer">
      <span class="badge badge-success">
        <span class="status-dot status-dot-active"></span>
        Tersedia
      </span>
      <button
        v-if="authStore.isRenter"
        class="btn btn-primary btn-sm"
        @click="$emit('rent', item)"
        :id="`btn-rent-${item.id}`"
      >
        Sewa
      </button>
      <button
        v-if="authStore.isOwner && item.owner_id === authStore.user?.id"
        class="btn btn-danger btn-sm"
        @click="$emit('delete', item.id)"
        :id="`btn-delete-${item.id}`"
      >
        Hapus
      </button>
    </div>
  </div>
</template>

<style scoped>
.item-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  overflow: hidden;
}

.item-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-icon {
  font-size: 2.5rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-glow);
  border-radius: var(--radius-lg);
}

.item-price-tag {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
}

.price-amount {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-light);
}

.price-period {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.item-card-body {
  flex: 1;
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.item-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}
</style>
