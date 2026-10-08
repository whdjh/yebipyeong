import Link from "next/link"

export default function NotFound() {
  return <main className="page-shell"><div className="empty-state"><h1>훈련장을 찾을 수 없어요</h1><p>주소를 확인하거나 목록에서 다시 찾아주세요.</p><Link className="text-button" href="/">훈련장 목록</Link></div></main>
}
