import type { APIRoute } from 'astro'
import { getAllPosts, sortPostsByDate } from '@utils/blogUtils'

export const prerender = true

export const GET: APIRoute = async () => {
  const posts = sortPostsByDate(await getAllPosts())
  const searchIndex = posts.map((post) => ({
    slug: post.slug,
    search: [post.data.title, post.data.description, ...(post.data.categories || []), ...(post.data.tags || []), post.body || '']
      .join(' ')
      .toLocaleLowerCase(),
  }))

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
