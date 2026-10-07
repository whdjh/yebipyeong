import { Suspense } from "react"
import TrainingCenterList from "./_components/training-center-list"

async function SearchResults({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { q } = await searchParams
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? ""

  // 실제 데이터 조회 연결 전에는 훈련장을 표시하지 않는다.
  return <TrainingCenterList centers={[]} query={query} />
}

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <main className="page-shell list-page">
      <div className="page-intro">
        <h1>어디에서<br className="mobile-break" /> 훈련받으셨나요?</h1>
        <p>다른 예비군이 경험한 훈련장 운영을 확인해보세요.</p>
      </div>
      <Suspense fallback={<TrainingCenterList centers={[]} loading />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
