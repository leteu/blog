import { defineLoader, loadEnv } from 'vitepress'

export interface Data {
  repo: `${string}/${string}`
  repoId: string
  category: string
  categoryId: string
}

declare const data: Data
export { data }

const env = loadEnv('', process.cwd())

export default defineLoader({
  load: (): Data => ({
    repo: env.VITE_GISCUS_REPO as `${string}/${string}`,
    repoId: env.VITE_GISCUS_REPO_ID,
    category: env.VITE_GISCUS_CATEGORY,
    categoryId: env.VITE_GISCUS_CATEGORY_ID,
  }),
})
