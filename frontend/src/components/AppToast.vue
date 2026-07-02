<script setup>
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()

function getIcon(type) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type] || icons.info
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" id="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="t in toast.toasts"
          :key="t.id"
          class="toast"
          :class="`toast-${t.type}`"
          @click="toast.remove(t.id)"
        >
          <span class="toast-icon">{{ getIcon(t.type) }}</span>
          <span class="toast-message">{{ t.message }}</span>
          <button class="toast-close" @click.stop="toast.remove(t.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: var(--space-6);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 420px;
  width: 100%;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  cursor: pointer;
  pointer-events: all;
  animation: slideInRight var(--transition-slow) ease;
}

.toast-success { border-left: 3px solid var(--color-success); }
.toast-error { border-left: 3px solid var(--color-danger); }
.toast-warning { border-left: 3px solid var(--color-warning); }
.toast-info { border-left: 3px solid var(--color-info); }

.toast-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 var(--space-1);
  transition: color var(--transition-fast);
  flex-shrink: 0;
}

.toast-close:hover {
  color: var(--color-text-primary);
}

/* === Transition === */
.toast-enter-active {
  transition: all var(--transition-slow) ease;
}

.toast-leave-active {
  transition: all var(--transition-base) ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform var(--transition-base) ease;
}

@media (max-width: 480px) {
  .toast-container {
    right: var(--space-3);
    left: var(--space-3);
    max-width: none;
  }
}
</style>
