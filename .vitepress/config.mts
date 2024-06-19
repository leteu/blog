import { defineConfig } from 'vitepress'

import { genFeed } from './genFeed'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { loadEnv } from 'vitepress'
import { HeadConfig } from 'vitepress'
import { Content } from './theme/posts.data'

dayjs.extend(timezone)

const env = loadEnv('', process.cwd())

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'leteu Dev',
  description: 'leteu 개발 블로그',
  cleanUrls: true,
  markdown: {
    math: true,
    lineNumbers: true,
  },
  lang: 'ko',
  head: [
    ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${env.VITE_GOOGLE_TAG}` }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${env.VITE_GOOGLE_TAG}');`,
    ],
    [
      'meta',
      {
        name: 'google-site-verification',
        content: `${env.VITE_GOOGLE_VERIFICATION}`,
      },
    ],
    [
      'meta',
      {
        name: 'naver-site-verification',
        content: `${env.VITE_NAVER_VERIFICATION}`,
      },
    ],
    [
      'meta',
      {
        name: 'msvalidate.01',
        content: `${env.VITE_BING_VERIFICATION}`,
      },
    ],
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
  transformHead: ({ page, pageData, siteData }) => {
    const head: HeadConfig[] = []

    head.push([
      'meta',
      {
        name: 'og:type',
        content: pageData.frontmatter.layout === 'home' ? 'website' : 'article',
      },
    ])
    head.push([
      'meta',
      { property: 'og:image', content: pageData.frontmatter.mainImg || `${env.VITE_HOST_URL}/images/logo.png` },
    ])
    head.push([
      'meta',
      {
        name: 'og:title',
        content: pageData.title || siteData.title,
      },
    ])
    head.push(['meta', { property: 'og:site_name', content: siteData.title }])
    head.push(['meta', { property: 'og:url', content: `${env.VITE_HOST_URL}/${page}` }])
    head.push(['meta', { property: 'og:locale', content: 'ko_KR' }])

    if (pageData.frontmatter.description) {
      head.push(['meta', { property: 'og:description', content: pageData.frontmatter.description }])
    }

    head.push([
      'meta',
      {
        property: 'article:published_time',
        content: dayjs.unix(pageData.frontmatter.timestamp).format('YYYY-MM-DDTHH:mm:ssZ'),
      },
    ])
    if (pageData.lastUpdated) {
      head.push([
        'meta',
        { property: 'article:modified_time', content: dayjs(pageData.lastUpdated).format('YYYY-MM-DDTHH:mm:ssZ') },
      ])
    }

    /* i18n */
    // for (const lang of []) {
    //   head.push(['meta', { property: 'og:locale:alternate', content: lang }])
    // }

    if (pageData.frontmatter.tags) {
      for (const tag of pageData.frontmatter.tags) {
        head.push(['meta', { property: 'article:tag', content: tag }])
      }
    }

    return head
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Portfolio', link: 'https://portfolio.leteu.dev' },
    ],

    darkModeSwitchLabel: '다크모드',

    outline: {
      label: '목차',
    },

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
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 459"><g><path d="M229.5,0C102.75,0,0,102.75,0,229.5S102.75,459,229.5,459,459,356.25,459,229.5,356.25,0,229.5,0ZM130.21,191.45a39.57,39.57,0,1,1,39.56-39.57A39.58,39.58,0,0,1,130.21,191.45ZM229.5,390a39.56,39.56,0,1,1,39.56-39.56A39.56,39.56,0,0,1,229.5,390Zm0-99.29a39.56,39.56,0,1,1,39.56-39.56A39.56,39.56,0,0,1,229.5,290.74Zm0-99.29a39.57,39.57,0,1,1,39.56-39.57A39.57,39.57,0,0,1,229.5,191.45Zm99.29,0a39.57,39.57,0,1,1,39.57-39.57A39.57,39.57,0,0,1,328.79,191.45Z" /></g></svg>',
        },
        link: 'https://leteu.tistory.com/',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>',
        },
        link: `${env.VITE_HOST_URL}/rss`,
      },
    ],

    footer: {
      copyright: `<a target="_blank" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> | © 2022-${dayjs().format(
        'YYYY',
      )}. leteu. All rights reserved.`,
    },
  },
  buildEnd: genFeed,
  sitemap: {
    hostname: env.VITE_HOST_URL,
  },
  srcExclude: ['**/README.md'],
})
