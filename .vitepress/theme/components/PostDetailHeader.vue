<template>
  <div class="detail-header">
    <img
      v-if="frontmatter.mainImg"
      :src="frontmatter.mainImg"
      alt=""
      class="main-img"
    />

    <h1>{{ frontmatter.title }}</h1>

    <div class="datetime">
      <span class="material-icons">schedule</span>
      {{ dayjs(frontmatter.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') }}
    </div>

    <div class="chip-list">
      <template
        v-for="(tag, index) in frontmatter.tags"
        :key="`tag-${index}`"
      >
        <TagChip
          :label="tag"
          show-tag
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(timezone)

const { frontmatter } = useData()
</script>

<style lang="scss" scoped>
.detail-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
}

.main-img {
  border-radius: 16px;
  width: 100%;
}

.datetime {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  color: var(--vp-c-text-2) !important;
  font-size: 16px;
  .material-icons {
    font-size: inherit;
  }
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
</style>
