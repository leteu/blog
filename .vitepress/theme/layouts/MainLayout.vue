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
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

import PostDetailHeader from '../components/PostDetailHeader.vue'
import PostDetailComment from '../components/PostDetailComment.vue'

const { Layout } = DefaultTheme
const { page } = useData()
</script>
