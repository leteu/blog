<template>
  <a
    v-if="!fail"
    :href="url"
    target="_blank"
    class="url-embed row"
    :style="`--theme-color: ${themeColor}`"
  >
    <div class="col url-embed__container">
      <div class="url-embed__title">{{ title }}</div>
      <div class="url-embed__desc">{{ description }}</div>
      <div class="col"></div>
      <div class="url-embed__info">
        <template v-if="favicon">
          <img
            :src="favicon"
            alt=""
            class="favicon"
          />
        </template>
        <span>{{ url }}</span>
      </div>
    </div>
    <div
      v-if="image"
      class="url-embed__image"
    >
      <img
        :src="image"
        alt=""
      />
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, PropType, ref } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
})

const fail = ref<boolean>(true)
const title = ref('')
const description = ref('')
const image = ref('')
const favicon = ref('')
const themeColor = ref('#2e2e2e')
const base = computed(() => new URL(props.url))

function getCurrectImageUrl(url: string) {
  if (url.startsWith('http')) {
    return new URL(url).href
  }

  if (url.startsWith('/')) {
    return new URL(`${base.value.origin}${url}`).href
  }

  return new URL(
    `${base.value.origin + base.value.pathname.substring(0, base.value.pathname.lastIndexOf('/') + 1)}${url}`,
  ).href
}

async function getImage(url: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve(img)
    }

    img.onerror = (error) => {
      reject(error)
    }

    img.src = url
  })
}

async function getMetaTagsFromURL(url: string) {
  try {
    const response = await fetch('https://corsproxy.io/?' + encodeURIComponent(url))
    const htmlString = await response.text()

    // Parse the HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')

    const title = doc.querySelector('title')!.text
    const metaTags = Array.from(doc.getElementsByTagName('meta')).reduce<Record<string, string>>((acc, cur) => {
      try {
        const key = cur.name || cur.getAttribute('property')
        if (!key) throw false

        acc[key] = cur.content
      } finally {
        return acc
      }
    }, {})

    const icon = (
      await Promise.all(
        Array.from(
          doc.querySelectorAll<HTMLLinkElement>(
            'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
          ),
        ).map((el) => getImage(getCurrectImageUrl(el.getAttribute('href')!))),
      )
    ).reduce<HTMLImageElement | null>((acc, cur) => {
      if (acc === null || cur.width > acc.width) {
        return cur
      }

      return acc
    }, null)

    return {
      title,
      ...metaTags,
      icon: icon?.src || null,
    }
  } catch (error) {
    console.error('Error fetching or parsing the URL:', error)
  }
}

onBeforeMount(async () => {
  try {
    const meta = await getMetaTagsFromURL(props.url)

    if (!meta) throw false

    fail.value = false

    title.value = meta['og:title'] || meta.title
    description.value = meta['og:description'] || meta['description']
    image.value = meta['og:image'] || ''
    favicon.value = meta['icon'] || ''
    themeColor.value = meta['theme-color'] || '#2e2e2e'
  } catch {
    fail.value = true
  }
})
</script>

<style lang="scss" scoped>
@mixin ellipse($line) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $line;
  line-height: 1.5em;
  max-height: $line * 1.5em;
}

.url-embed {
  position: relative;
  height: 150px;
  text-decoration: none;
  background: #fff;
  &::before {
    content: '';
    display: block;
    background: var(--theme-color);
    width: 5px;
    height: auto;
    left: 0;
    top: 0;
  }
  &:hover {
    .url-embed__title {
      text-decoration: underline;
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border-top: 1px solid var(--vp-c-gray-1);
    border-bottom: 1px solid var(--vp-c-gray-1);
  }
  &__title {
    @include ellipse(1);
  }
  &__desc {
    color: #999;
    font-weight: normal;
    font-size: 14px;
    line-height: 1.5em;
    overflow: hidden;
    @include ellipse(3);
  }
  &__info {
    justify-self: flex-end;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--space-xs);
    font-size: 12px;
    color: #a2a2a2;
    span {
      @include ellipse(1);
    }
    img {
      width: 16px;
      height: 16px;
    }
  }

  &__image {
    height: 100%;
    border-top: 1px solid var(--vp-c-gray-1);
    border-bottom: 1px solid var(--vp-c-gray-1);
    display: flex;
    img {
      width: 100%;
      height: auto;
    }
  }

  > div:last-child {
    border-right: 1px solid var(--vp-c-gray-1);
  }
}
.favicon {
  width: 32px;
  height: 32px;
}
</style>
