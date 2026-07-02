<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})
</script>

<template>
  <div class="spinner-wrapper">
    <div class="spinner" :class="`spinner-${size}`">
      <div class="spinner-ring"></div>
    </div>
  </div>
</template>

<style scoped>
.spinner-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.spinner {
  position: relative;
}

.spinner-sm { width: 24px; height: 24px; }
.spinner-md { width: 40px; height: 40px; }
.spinner-lg { width: 56px; height: 56px; }

.spinner-ring {
  width: 100%;
  height: 100%;
  border: 3px solid var(--color-bg-tertiary);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-sm .spinner-ring { border-width: 2px; }
.spinner-lg .spinner-ring { border-width: 4px; }
</style>
