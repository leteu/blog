import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { Feed } from 'feed'
import { writeFileSync } from 'fs'
import path from 'path'
import { createContentLoader, type SiteConfig } from 'vitepress'

dayjs.extend(timezone)

const baseUrl = 'https://leteu.dev'

export async function genFeed(config: SiteConfig) {
  const feed = new Feed({
    title: 'Leteu Dev',
    description: 'Leteu 개발 블로그',
    id: baseUrl,
    link: baseUrl,
    language: 'ko',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `<a target="_blank" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> | © 2022-${dayjs().format(
      'YYYY',
    )}. leteu. All rights reserved.`,
  })

  const posts = await createContentLoader('posts/*.md', {
    excerpt: true,
    render: true,
  }).load()

  posts.sort((a, b) => b.frontmatter.timestamp - a.frontmatter.timestamp)

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt,
      content: html?.replace(/&ZeroWidthSpace;/gi, '').replace(/\.html/gi, ''),
      author: [
        {
          name: 'Shin Gyuhyeon',
          email: 'contact@leteu.dev',
          link: 'https://leteu.dev',
        },
      ],
      date: new Date(frontmatter.timestamp),
    })
  }

  writeFileSync(path.join(config.outDir, 'rss.xml'), feed.rss2())
}
