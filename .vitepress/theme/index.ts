// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './consoleText'
import './style.css'
import './noto-sans-korean.css'
import './material-icons.css'
import './meslo-lgs-nf.css'
import MainLayout from './layouts/MainLayout.vue'
import PostList from './components/PostList.vue'
import FootnoteTooltip from './components/FootnoteTooltip.vue'

export default {
  extends: DefaultTheme,
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   })
  // },
  Layout: MainLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('PostList', PostList)
    app.component('FootnoteTooltip', FootnoteTooltip)
  },
} satisfies Theme
