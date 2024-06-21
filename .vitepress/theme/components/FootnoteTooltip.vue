<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'

const props = defineProps({
  footnote: {
    type: [Number, String],
    required: true,
  },
})

onMounted(() => {
  nextTick(() => {
    const fn = document.getElementById(`fn${props.footnote}`)!
    const fnref = document.getElementById(`fnref${props.footnote}`)!

    const fnClone = fn.querySelector('p')?.cloneNode(true) as HTMLElement
    fnClone.removeChild(fnClone.querySelector('a')!)

    fnref.dataset.tooltip = fnClone.innerText
  })
})
</script>

<style lang="scss">
[data-tooltip] {
  position: relative; /* opinion 1 */

  &::before,
  &::after {
    text-transform: none; /* opinion 2 */
    font-size: 0.9em; /* opinion 3 */
    line-height: 1;
    user-select: none;
    pointer-events: none;
    position: absolute;
    display: none;
    opacity: 0;
  }

  &::before {
    content: '';
    border: 5px solid transparent; /* opinion 4 */
    z-index: 1001; /* absurdity 1 */
  }

  &::after {
    content: attr(data-tooltip); /* magic! */

    /* most of the rest of this is opinion */
    font-family: Helvetica, sans-serif;
    text-align: center;

    /*
      Let the content set the size of the tooltips
      but this will also keep them from being obnoxious
      */
    min-width: 3em;
    white-space: nowrap;
    padding: 1ch 1.5ch;
    border-radius: 0.3ch;
    box-shadow: 0 1em 2em -0.5em rgba(0, 0, 0, 0.35);
    background: #555;
    color: #fff;
    z-index: 1000; /* absurdity 2 */
  }

  &:hover::before,
  &:hover::after {
    display: block;
    animation: tooltips-vert 300ms ease-out forwards;
    left: 50%;
    transform: translate(-50%, -0.5em);
  }

  &::before {
    bottom: 100%;
    border-bottom-width: 0;
    border-top-color: #555;
  }

  &::after {
    bottom: calc(100% + 5px);
  }
}

/* don't show empty tooltips */
[data-tooltip='']::before,
[data-tooltip='']::after {
  display: none !important;
}

/* KEYFRAMES */
@keyframes tooltips-vert {
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes tooltips-horz {
  to {
    opacity: 1;
    transform: translate(0, -50%);
  }
}
</style>
