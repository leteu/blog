<template>
  <Giscus
    id="comments"
    :repo="giscus.repo"
    :repo-id="giscus.repoId"
    :category="giscus.category"
    :category-id="giscus.categoryId"
    mapping="pathname"
    reactions-enabled="1"
    emit-metadata="0"
    input-position="bottom"
    :theme="theme"
    loading="lazy"
    lang="ko"
  />
</template>

<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useData } from 'vitepress'
import { computed } from 'vue'

import { data as giscus } from '../giscus.data'

const { isDark } = useData()

const theme = computed(() => (isDark.value ? 'dark' : 'light'))
</script>
