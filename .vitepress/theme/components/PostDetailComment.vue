<template>
  <div ref="comments"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const comments = ref<HTMLDivElement>()

onMounted(() => {
  const utteranc = document.createElement('script')
  utteranc.src = 'https://utteranc.es/client.js'
  utteranc.setAttribute('repo', 'leteu/blog')
  utteranc.setAttribute('issue-term', 'pathname')
  utteranc.setAttribute('label', '[Comments]')
  utteranc.setAttribute('theme', 'preferred-color-scheme')
  utteranc.crossOrigin = 'anonymous'
  utteranc.async = true

  comments.value?.appendChild(utteranc)
})
</script>
