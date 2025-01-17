import * as cheerio from 'cheerio'
import fs from 'node:fs'
import path from 'node:path'

const embedUrlPattern =
  /::: embed-url ((https?:\/\/)?[\w-]+(\.[\w-]+)+(\.[a-zA-Z0-9]{2,})?(\/[\w-]+(\/[\w-]+)*)*(.html)?\/?(\?[\w-]+=[\w]+((&[\w-]+=[\w-]+)?)*)?) :::/gi

const urlPattern =
  /((https?:\/\/)?[\w-]+(\.[\w-]+)+(\.[a-zA-Z0-9]{2,})?(\/[\w-]+(\/[\w-]+)*)*(.html)?\/?(\?[\w-]+=[\w]+((&[\w-]+=[\w-]+)?)*)?)/

type MetaData = Record<string, string>

async function prefetchMetaDatas() {
  const dir = path.resolve(__dirname, '../../posts')
  const files = fs.readdirSync(dir)

  const urls = files.reduce<string[]>((acc, cur) => {
    const filepath = path.join(dir, cur)
    const file = fs.readFileSync(filepath, 'utf-8')
    const match = file.match(embedUrlPattern)

    if (!match) return acc

    for (const item of match) {
      acc.push(item.match(urlPattern)![1])
    }

    return acc
  }, [])

  const metas = new Map<string, MetaData>()

  for (const url of urls) {
    metas.set(url, await getMetaTagsFromURL(url))
  }

  return metas
}

async function getMetaTagsFromURL(url: string): Promise<MetaData> {
  try {
    const response = await fetch(url)
    const htmlString = await response.text()

    const $ = cheerio.load(htmlString)

    const title = $('title').text()
    const metaTags = Array.from($('meta')).reduce<Record<string, string>>((acc, cur) => {
      const el = $(cur)

      const key = el.attr('name') || el.attr('property')
      if (!key) return acc

      acc[key] = el.attr('content')!

      return acc
    }, {})

    return {
      title,
      ...metaTags,
    }
  } catch (error) {
    console.error('Error fetching or parsing the URL:', error)
    return {}
  }
}

function getUrlEmbed(url: string, meta: MetaData) {
  try {
    if (!Object.keys(meta).length) throw false

    const title = meta['og:title'] || meta.title
    const description = meta['og:description'] || meta['description']
    const image = meta['og:image'] || ''
    const themeColor = meta['theme-color'] || '#2e2e2e'

    return `
      <div>
        <a
          href="${url}"
          target="_blank"
          class="url-embed row"
          style="--theme-color: ${themeColor}"
        >
          <div class="col url-embed__container">
            <div class="url-embed__title">${title}</div>
            <div class="url-embed__desc">${description}</div>
            <div class="col"></div>
            <div class="url-embed__info">
              <span>${url}</span>
            </div>
          </div>
          ${image ? `<div class="url-embed__image"><img src="${image}" alt="" /></div>` : ''}
        </a>
      </div>`
  } catch {
    return ''
  }
}
export { getUrlEmbed, prefetchMetaDatas, embedUrlPattern, urlPattern }
