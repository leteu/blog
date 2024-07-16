import { createContentLoader } from 'vitepress'

interface Tag {
  label: string
  count: number
}
declare const data: Tag[]

export { Tag, data }
export default createContentLoader('posts/*.md', {
  transform: (raw): Tag[] =>
    raw
      .reduce<Tag[]>((acc, cur) => {
        (cur.frontmatter.tags as string[]).forEach((key) => {
          const index = acc.findIndex((el) => el.label === key)
          if (index < 0) {
            acc.push({ label: key, count: 1 })
            return
          }
          acc[index].count++
        })

        return acc
      }, [])
      .sort((a, b) => b.count - a.count),
})
