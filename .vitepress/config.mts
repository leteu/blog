import { createContentLoader, defineConfig } from 'vitepress'

import markdownItFootnote from 'markdown-it-footnote'
import { genFeed } from './genFeed'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'leteu',
  description: 'A VitePress Site',
  cleanUrls: true,
  markdown: {
    math: true,
    lineNumbers: true,
    config: (md) => {
      md.use(markdownItFootnote)
    },
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '128x128',
        href: '/icons/favicon-128x128.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/icons/favicon-96x96.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/icons/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/icons/favicon-16x16.png',
      },
    ],
    ['link', { rel: 'icon', type: 'image/ico', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/svg', href: '/favicon.svg' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Portfolio', link: 'https://portfolio.leteu.dev' },
    ],

    outline: {
      label: '목차',
    },

    darkModeSwitchLabel: '다크모드',

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        _render: (src, env, md) => {
          const html = md.render(src, env)
          if (env.frontmatter?.search === false) return ''
          return env.frontmatter?.title ? md.render('# ' + env.frontmatter?.title) + html : html
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leteu' },
      {
        icon: 'discord',
        link: 'https://discordapp.com/users/208842367019515905',
      },
      {
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 459"><g><path d="M229.5,0C102.75,0,0,102.75,0,229.5S102.75,459,229.5,459,459,356.25,459,229.5,356.25,0,229.5,0ZM130.21,191.45a39.57,39.57,0,1,1,39.56-39.57A39.58,39.58,0,0,1,130.21,191.45ZM229.5,390a39.56,39.56,0,1,1,39.56-39.56A39.56,39.56,0,0,1,229.5,390Zm0-99.29a39.56,39.56,0,1,1,39.56-39.56A39.56,39.56,0,0,1,229.5,290.74Zm0-99.29a39.57,39.57,0,1,1,39.56-39.57A39.57,39.57,0,0,1,229.5,191.45Zm99.29,0a39.57,39.57,0,1,1,39.57-39.57A39.57,39.57,0,0,1,328.79,191.45Z" /></g></svg>`,
        },
        link: 'https://leteu.tistory.com/',
      },
    ],

    footer: {
      copyright: `<a target="_blank" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> | © 2022-${new Date().getFullYear()}. leteu. All rights reserved.`,
    },
  },
  buildEnd: genFeed,
})
