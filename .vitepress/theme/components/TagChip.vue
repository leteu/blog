<template>
  <div
    class="chip"
    @click="onClickTag"
  >
    <template v-if="showTag"># </template>
    {{ label }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  showTag: {
    type: Boolean,
    default: () => false,
  },
})

const emit = defineEmits<{
  (e: 'click:tag', payload: string): void
}>()

const onClickTag = () => {
  emit('click:tag', props.label)
}
</script>

<style lang="scss" scoped>
.chip {
  background: var(--vp-c-brand-5);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  padding: 4px 8px;
}
</style>
