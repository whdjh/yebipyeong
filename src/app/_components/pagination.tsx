import Link from "next/link"

export default function Pagination({ path, query = "", page, limit, hasNext }: {
  path: string
  query?: string
  page: number
  limit: number
  hasNext: boolean
}) {
  function href(nextPage: number) {
    const params = new URLSearchParams({ page: String(nextPage), limit: String(limit) })
    if (query) params.set("q", query)
    return `${path}?${params}`
  }

  if (page === 1 && !hasNext) return null
  return <nav className="pagination" aria-label="페이지 이동">
    {page > 1 ? <Link className="text-button" href={href(page - 1)} prefetch={false}>이전</Link> : <span />}
    <span>{page}페이지</span>
    {hasNext ? <Link className="text-button" href={href(page + 1)} prefetch={false}>다음</Link> : <span />}
  </nav>
}
