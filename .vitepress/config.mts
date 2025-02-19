import * as cheerio from 'cheerio'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import footnote from 'markdown-it-footnote'
import { defineConfig, loadEnv, HeadConfig } from 'vitepress'

import { genFeed } from './genFeed'
import { embedUrlPattern, getUrlEmbed, prefetchMetaDatas, urlPattern } from './theme/getUrlEmbed'

dayjs.extend(timezone)

const env = loadEnv('', process.cwd())

// https://vitepress.dev/reference/site-config
export default defineConfig(
  await (async () => {
    const metas = await prefetchMetaDatas()

    return {
      title: 'leteu Dev',
      description: 'leteu 개발 블로그',
      cleanUrls: true,
      markdown: {
        math: true,
        lineNumbers: true,
        config: async (md) => {
          md.use(footnote)
          md.core.ruler.push('embed_url', (state) => {
            const tokens = state.tokens
            let i = 0
            while (i < tokens.length) {
              if (tokens[i]?.type === 'inline' && tokens[i + 1] && tokens[i + 1]!.type === 'paragraph_close') {
                const content = tokens[i]!.content.trim()
                const match = content.match(embedUrlPattern)

                if (!match) {
                  i++
                  continue
                }

                const url = match[0].match(urlPattern)![1]
                const meta = metas.get(url) || {}

                if (i > 0) {
                  tokens.splice(i - 1, 1)
                  i--
                }

                tokens[i].type = 'html_block'
                tokens[i].tag = ''
                tokens[i].level = 0
                tokens[i].content = getUrlEmbed(url, meta)
                tokens[i].children = null

                tokens.splice(i + 1, 1)
              }
              i++
            }
          })
        },
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

      gtag('config', '${env.VITE_GOOGLE_TAG}', {
        'cookie_flags': 'SameSite=None;Secure'
      });`,
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
      transformHead: ({ page, pageData, siteData, content: htmlContent }) => {
        const head: HeadConfig[] = []

        head.push([
          'meta',
          {
            name: 'theme-color',
            content: '#62decc',
          },
        ])
        head.push([
          'meta',
          {
            name: 'og:type',
            content: pageData.frontmatter.layout === 'home' ? 'website' : 'article',
          },
        ])
        head.push([
          'meta',
          {
            property: 'og:image',
            content: `${env.VITE_HOST_URL}${pageData.frontmatter.mainImg || '/images/logo.png'}`,
          },
        ])
        head.push([
          'meta',
          {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
        ])
        head.push([
          'meta',
          {
            name: 'og:title',
            content: pageData.frontmatter.title || siteData.title,
          },
        ])
        head.push(['meta', { property: 'og:site_name', content: siteData.title }])
        head.push(['meta', { property: 'og:url', content: `${env.VITE_HOST_URL}/${page}` }])
        head.push(['meta', { property: 'og:locale', content: 'ko_KR' }])

        if (pageData.frontmatter.layout !== 'home') {
          const innerText = cheerio
            .load(htmlContent)('main') // 본문에서
            .find('a')
            .remove()
            .end()
            .find('h2')
            .remove() // 제목 제거
            .end()
            .find('h3')
            .remove() // 제목 제거
            .end()
            .find('h4')
            .remove() // 제목 제거
            .end()
            .find('.vp-adaptive-theme')
            .remove() // 코드블럭 제거
            .end()
            .text()
            .replace(/ {2}/gi, ' ')

          const content = `${pageData.frontmatter.subTitle ? pageData.frontmatter.subTitle + ', ' : ''}${innerText}`

          const description = content.length > 200 ? content.substring(0, 197) + '...' : content

          head.push([
            'meta',
            {
              property: 'og:description',
              content: description,
            },
          ])
        } else {
          head.push([
            'meta',
            {
              property: 'og:description',
              content: siteData.description,
            },
          ])
        }

        if (pageData.frontmatter.timestamp) {
          head.push([
            'meta',
            {
              property: 'article:published_time',
              content: dayjs.unix(pageData.frontmatter.timestamp).format('YYYY-MM-DDTHH:mm:ssZ'),
            },
          ])
        }
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

        // head.push([
        //   'link',
        //   {
        //     type: 'application/json+oembed',
        //     href: `${env.VITE_HOST_URL}/oembed.json`,
        //   },
        // ])

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
            _render: (src, environ, md) => {
              const html = md.render(src, env)
              if (environ.frontmatter?.search === false) return ''
              return environ.frontmatter?.title ? md.render('# ' + environ.frontmatter?.title) + html : html
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
            ariaLabel: 'tistory',
          },
          {
            icon: {
              svg: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>',
            },
            link: `${env.VITE_HOST_URL}/rss`,
            ariaLabel: 'rss',
          },
        ],

        footer: {
          copyright: `<a target="_blank" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> | © 2022-${dayjs().format(
            'YYYY',
          )}. leteu. All rights reserved.`,
        },

        lastUpdated: {
          text: 'Updated at',
          formatOptions: {
            dateStyle: 'full',
            timeStyle: 'medium',
          },
        },
      },
      buildEnd: genFeed,
      sitemap: {
        hostname: env.VITE_HOST_URL,
      },
      srcExclude: ['**/README.md'],
      vite: {
        css: {
          preprocessorOptions: {
            scss: {
              api: 'modern-compiler',
            },
          },
        },
      },
    }
  })(),
)
