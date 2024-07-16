<template>
  <div class="detail-header vp-doc">
    <img
      v-if="frontmatter.mainImg"
      :src="frontmatter.mainImg"
      :alt="`${frontmatter.title} main image`"
      class="main-img"
    />

    <h1>{{ frontmatter.title }}</h1>

    <div class="info-container">
      <div class="datetime">
        <span class="material-icons">schedule</span>
        <ClientOnly>
          <time :datetime="getTime(frontmatter.timestamp)">
            {{ getTime(frontmatter.timestamp) }}
          </time>
        </ClientOnly>
      </div>

      <template v-if="page.lastUpdated">
        <div class="datetime">
          <span class="material-icons">update</span>
          <ClientOnly>
            <time :datetime="getTime(page.lastUpdated / 1000)">
              {{ getTime(page.lastUpdated / 1000) }}
            </time>
          </ClientOnly>
        </div>
      </template>
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

import TagChip from './TagChip.vue'

dayjs.extend(timezone)

const { frontmatter, page } = useData()

function getTime(timestamp: number) {
  return dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<style lang="scss" scoped>
.detail-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.main-img {
  border-radius: 16px;
  width: 100%;
}

.info-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-md);
  flex-wrap: wrap;
}
.datetime {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-xs);
  color: var(--vp-c-text-2) !important;
  font-size: 16px;
  line-height: 24px;
  .material-icons {
    font-size: 20px;
    line-height: 24px;
  }
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}
</style>
