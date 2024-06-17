// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './noto-sans-korean.css'
import './material-icons.css'
import './meslo-lgs-nf.css'
import PostList from './components/PostList.vue'
import PostDetailHeader from './components/PostDetailHeader.vue'
import TagChip from './components/TagChip.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('PostList', PostList)
    app.component('PostDetailHeader', PostDetailHeader)
    app.component('TagChip', TagChip)
  },
} satisfies Theme
