<template>
  <div
    class="chip"
    :class="{
      chip__active: active,
      chip__clickable: clickable,
    }"
    @click="onClickTag"
  >
    <template v-if="showTag"># </template>
    {{ label }}
    <template v-if="count">
      <span class="chip__count">
        {{ count }}
      </span>
    </template>
    <template v-if="active">
      <span class="chip__active__icon material-icons">cancel</span>
    </template>
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
  count: {
    type: Number,
    default: () => undefined,
  },
  clickable: {
    type: Boolean,
    default: () => false,
  },
  active: {
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
  padding: var(--space-xs) var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &__clickable {
    cursor: pointer;
  }
  &__count {
    margin-left: var(--space-xs);
  }
  &__active {
    background: var(--vp-c-brand-1);
    color: var(--vp-c-white);
    &__icon {
      font-size: 12px;
      margin-left: var(--space-xs);
    }
  }
}

.dark .chip {
  background: none;
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  &__active {
    background: var(--vp-c-brand-2);
    color: var(--vp-c-gray-3);
  }
}
</style>
