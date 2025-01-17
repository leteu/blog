<template>
  <Layout>
    <template #doc-before>
      <div class="container">
        <PostDetailHeader />
      </div>
    </template>
    <template #doc-after>
      <PostDetailComment :key="page.relativePath" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import PostDetailComment from '../components/PostDetailComment.vue'
import PostDetailHeader from '../components/PostDetailHeader.vue'

const { Layout } = DefaultTheme
const { page } = useData()
</script>
