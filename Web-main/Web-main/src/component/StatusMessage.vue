<script setup>
defineProps({
  message: {
    type: Object,
    default: () => ({ text: "", kind: "info" }),
  },
});
</script>

<template>
  <p class="status-message" :data-kind="message.kind" role="status" aria-live="polite">
    {{ message.text }}
  </p>
</template>

<style scoped>
.status-message {
  min-height: 20px;
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.status-message[data-kind="ok"] {
  color: var(--ok);
}

.status-message[data-kind="error"] {
  color: var(--danger);
}
</style>
