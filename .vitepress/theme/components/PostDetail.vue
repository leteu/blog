<template>
  <div>
    {{ frontmatter.timestamp }}
    <hr>
    {{ frontmatter.title }}
    <hr>
    {{ page  }}
    <hr>
    {{ frontmatter }}
    <hr>
    <Content />
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'

const { page, frontmatter } = useData()
</script>
