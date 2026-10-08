"use client"

export default function ErrorPage({ retry }: { retry: () => void }) {
  return <main className="page-shell"><div className="empty-state" role="alert">
    <h1>정보를 불러오지 못했어요</h1>
    <p>잠시 후 다시 시도해주세요.</p>
    <button className="text-button" type="button" onClick={retry}>다시 불러오기</button>
  </div></main>
}
