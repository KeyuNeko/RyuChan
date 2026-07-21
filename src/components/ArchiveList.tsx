import { useMemo } from 'react'
import { Archive, BookOpen, Calendar } from 'lucide-react'
import dayjs from 'dayjs'

interface Post {
  slug: string
  data: {
    title: string
    pubDate: Date | string
    description?: string
  }
}

interface ArchiveListProps {
  posts: Post[]
  labels: {
    archivePage: string
    post: string
    posts: string
    backToBlog: string
    archivePageDescription: string
    noPosts: string
    months: string[]
  }
  dateFormat: string
}

export default function ArchiveList({ posts, labels, dateFormat }: ArchiveListProps) {
  const groupedPosts = useMemo(() => {
    const groups = new Map<string, Map<string, Post[]>>()

    posts.forEach((post) => {
      const date = dayjs(post.data.pubDate)
      const year = date.format('YYYY')
      const month = date.format('M')
      if (!groups.has(year)) groups.set(year, new Map())
      const yearGroup = groups.get(year)!
      if (!yearGroup.has(month)) yearGroup.set(month, [])
      yearGroup.get(month)!.push(post)
    })

    return groups
  }, [posts])

  const years = Array.from(groupedPosts.keys()).sort((a, b) => Number(b) - Number(a))
  const getMonthName = (month: string) => labels.months[Number(month) - 1] || month

  return (
    <>
      <header className="mb-6 rounded-2xl border border-base-content/10 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-primary">ARCHIVE</p>
            <div className="flex flex-wrap items-center gap-3">
              <Archive className="h-6 w-6 text-accent" aria-hidden="true" />
              <h1 className="text-2xl font-bold md:text-3xl">{labels.archivePage}</h1>
              <span className="badge badge-accent">
                {posts.length} {posts.length === 1 ? labels.post : labels.posts}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-base-content/75">{labels.archivePageDescription}</p>
          </div>
          <a href="/blog" className="btn btn-outline btn-sm gap-2 rounded-xl">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {labels.backToBlog}
          </a>
        </div>
      </header>

      <section className="rounded-2xl border border-base-content/10 bg-base-100 p-4 shadow-sm sm:p-6" aria-label={labels.archivePage}>
        {years.length > 0 ? (
          <div className="archives-timeline">
            {years.map((year) => (
              <div key={year} className="timeline-year">
                <div className="year-header">
                  <div className="year-badge">{year}</div>
                </div>
                <div className="year-content">
                  {Array.from(groupedPosts.get(year)!.entries())
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([month, monthPosts]) => (
                      <div key={month} className="timeline-month">
                        <h2 className="month-title">
                          <Calendar className="month-icon" aria-hidden="true" />
                          <span>{getMonthName(month)} {year}</span>
                          <span className="month-count">{monthPosts.length}</span>
                        </h2>
                        <ul className="archive-posts">
                          {monthPosts.map((post) => (
                            <li key={post.slug} className="archive-item">
                              <a href={`/blog/${post.slug}`} className="archive-card block">
                                <time className="archive-date">{dayjs(post.data.pubDate).format(dateFormat)}</time>
                                <h3 className="archive-title">{post.data.title}</h3>
                                {post.data.description && <p className="archive-description">{post.data.description}</p>}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Archive className="empty-icon" aria-hidden="true" />
            <p className="empty-text">{labels.noPosts}</p>
          </div>
        )}
      </section>
    </>
  )
}
