<template>
  <div class="container">
    <div class="post-list">
      <template
        v-for="(post, index) in posts"
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
              {{ dayjs(post.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
          <div
            class="post__main-img"
            v-if="post.mainImg"
          >
            <img
              :src="post.mainImg"
              :alt="`${post.title} 메인 이미지`"
            />
          </div>
        </a>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { data as posts } from '../posts.data'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(timezone)
</script>

<style lang="scss" scoped>
.post-list {
  display: flex;
  flex-direction: column;
}

.post {
  position: relative;
  display: flex;
  flex-direction: row;
  text-decoration: none !important;
  color: unset !important;
  height: 150px;
  transition: box-shadow 0.25s, color 0.25s, opacity 0.25s !important;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0);
  padding: 16px;
  gap: 16px;

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    &__title {
      color: var(--vp-c-text-1) !important;
      font-size: 20px;
    }
    &__subtitle {
      flex: 1;
      color: var(--vp-c-text-2) !important;
      font-size: 14px;
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

@media (max-width: 767px) {
  .post {
    height: 120px;
    padding: 8px;

    &__content {
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
}
</style>
