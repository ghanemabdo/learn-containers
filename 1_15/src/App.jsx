import { useEffect, useState } from 'react'

const SOURCES = { bbc: 'BBC', npr: 'NPR', guardian: 'The Guardian', aljazeera: 'Al Jazeera' }
const PAGE_SIZE = 10

const text = (el, tag) => el.querySelector(tag)?.textContent ?? ''
const plain = (html) => new DOMParser().parseFromString(html, 'text/html').body.textContent

async function loadFeed(id) {
  const xml = await (await fetch(`/feeds/${id}`)).text()
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  return [...doc.querySelectorAll('item')].map((i) => ({
    source: SOURCES[id],
    title: text(i, 'title'),
    link: text(i, 'link'),
    summary: plain(text(i, 'description')),
    date: new Date(text(i, 'pubDate')),
  }))
}

export default function App() {
  const [articles, setArticles] = useState([])
  const [failed, setFailed] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    Promise.allSettled(Object.keys(SOURCES).map(loadFeed)).then((results) => {
      setArticles(
        results.flatMap((r) => (r.status === 'fulfilled' ? r.value : [])).sort((a, b) => b.date - a.date)
      )
      setFailed(Object.values(SOURCES).filter((_, i) => results[i].status === 'rejected'))
      setLoading(false)
    })
  }, [])

  const pages = Math.ceil(articles.length / PAGE_SIZE)
  const shown = articles.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 16, fontFamily: 'sans-serif' }}>
      <h1>Latest News</h1>
      {loading && <p>Loading…</p>}
      {failed.length > 0 && <p style={{ color: 'crimson' }}>Could not load: {failed.join(', ')}</p>}
      {shown.map((a) => (
        <article key={a.link} style={{ marginBottom: 20 }}>
          <small>
            {a.source} · {a.date.toLocaleString()}
          </small>
          <h3 style={{ margin: '4px 0' }}>
            <a href={a.link} target="_blank" rel="noreferrer">
              {a.title}
            </a>
          </h3>
          <p style={{ margin: 0 }}>{a.summary}</p>
        </article>
      ))}
      {pages > 1 && (
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setPage(page - 1)} disabled={page === 0}>
            Prev
          </button>
          <span>
            Page {page + 1} / {pages}
          </span>
          <button onClick={() => setPage(page + 1)} disabled={page >= pages - 1}>
            Next
          </button>
        </nav>
      )}
    </main>
  )
}
