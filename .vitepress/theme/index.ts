// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'

import './material-icons.css'
import './meslo-lgs-nf.css'
import './noto-sans-korean.css'
import './style.css'
import './style.scss'

import DefaultTheme from 'vitepress/theme'

import FootnoteTooltip from './components/FootnoteTooltip.vue'
import PostList from './components/PostList.vue'
import './consoleText'
import MainLayout from './layouts/MainLayout.vue'

export default {
  extends: DefaultTheme,
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // https://vitepress.dev/guide/extending-default-theme#layout-slots
  //   })
  // },
  Layout: MainLayout,
  enhanceApp({ app }) {
    // ...
    app.component('PostList', PostList)
    app.component('FootnoteTooltip', FootnoteTooltip)
  },
} satisfies Theme
