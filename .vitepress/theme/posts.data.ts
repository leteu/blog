import { createContentLoader } from 'vitepress'

interface Content {
  url: string
  title: string
  subtitle: string
  timestamp: number
  category: string
  tags: string[]
  mainImg?: string
}
declare const data: Content[]

export { Content, data }
export default createContentLoader('posts/*.md', {
  transform: (raw): Content[] =>
    raw
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title,
        subtitle: frontmatter.subtitle,
        timestamp: frontmatter.timestamp,
        category: frontmatter.category,
        tags: frontmatter.tags,
        mainImg: frontmatter.mainImg,
      }))
      .sort((a, b) => b.timestamp - a.timestamp),
})
