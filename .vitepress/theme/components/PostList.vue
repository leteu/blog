<template>
  <div class="home-container">
    <div class="post-list">
      <template
        v-for="(post, index) in filterdPosts"
        :key="`post-${index}`"
      >
        <a
          :href="post.url"
          class="post"
        >
          <div class="post__content">
            <div class="post__content__title">{{ post.title }}</div>
            <div class="post__content__subtitle">{{ post.subtitle }}</div>
            <div class="post__content__datetime">
              <span class="material-icons">schedule</span>
              <ClientOnly>
                <time :datetime="getTime(post.timestamp)">
                  {{ getTime(post.timestamp) }}
                </time>
              </ClientOnly>
            </div>
          </div>
          <div
            v-if="post.mainImg"
            class="post__main-img"
          >
            <img
              :src="post.mainImg"
              :alt="`${post.title} 메인 이미지`"
            />
          </div>
        </a>
      </template>
    </div>
    <div class="side-content">
      <div class="side-content__tags">
        <span class="side-content__tags__title">태그</span>
        <div class="side-content__tags__list">
          <template
            v-for="(tag, index) in tags"
            :key="`tag-${index}__${tag.label}`"
          >
            <TagChip
              :label="tag.label"
              :count="tag.count"
              :active="selectedTags.has(tag.label)"
              clickable
              @click:tag="onClickTag(tag)"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tag } from '../tags.data'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { computed, ref } from 'vue'

import TagChip from '../components/TagChip.vue'
import { data as posts } from '../posts.data'
import { data as tags } from '../tags.data'

dayjs.extend(timezone)

const selectedTags = ref<Set<Tag['label']>>(new Set())
const filterdPosts = computed(() => {
  if (!selectedTags.value.size) return posts

  return posts.filter((post) => post.tags.some((tag) => selectedTags.value.has(tag)))
})

function getTime(timestamp: number) {
  return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
}

function onClickTag(tag: Tag) {
  if (selectedTags.value.has(tag.label)) {
    selectedTags.value.delete(tag.label)
    return
  }

  selectedTags.value.add(tag.label)
}
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  gap: var(--space-lg);
}

.post-list {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.post {
  position: relative;
  display: flex;
  flex-direction: row;
  text-decoration: none !important;
  color: unset !important;
  height: 150px;
  transition:
    box-shadow 0.25s,
    color 0.25s,
    opacity 0.25s !important;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0);
  padding: var(--space-md);
  gap: var(--space-md);

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    * {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      line-height: 1.5em;
      max-height: 3em;
    }
    &__title {
      color: var(--vp-c-text-1) !important;
      font-size: 20px;
    }
    &__subtitle {
      flex: 1;
      color: var(--vp-c-text-2) !important;
      font-size: 14px;
      line-height: 14px;
    }
    &__datetime {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
      color: var(--vp-c-text-2) !important;
      font-size: 12px;
      .material-icons {
        font-size: inherit;
      }
    }
  }
  &__main-img {
    width: 170px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: scale 0.25s;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #e2e2e2;
  }

  &:hover {
    .post {
      &__content {
        &__title {
          color: var(--vp-c-brand-1) !important;
        }
      }
      &__main-img {
        img {
          scale: 1.1;
        }
      }
    }
  }
}

.side-content {
  width: 300px;
  &__tags {
    &__title {
      color: var(--vp-c-text-2) !important;
      font-size: 12px;
    }
    &__list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
    }
  }
}

@media (max-width: 767px) {
  .post {
    height: 120px;
    padding: 8px;

    &__content {
      gap: 4px;

      &__title {
        font-size: 16px;
      }
      &__subtitle {
        font-size: 12px;
      }
      &__datetime {
        font-size: 10px;
      }
    }

    &__main-img {
      width: 85px;
      height: 60px;
    }
  }

  .side-content {
    display: none;
  }
}

@media (max-width: 900px) {
  .side-content {
    display: none;
  }
}
</style>
