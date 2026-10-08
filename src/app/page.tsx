import { Suspense } from "react"
import TrainingCenterList from "./_components/training-center-list"
import { searchTrainingCenters } from "@/lib/training-centers"
import { parseSearchParams } from "@/lib/validation"
import { RequestError } from "@/lib/http"

async function SearchResults({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const params = await searchParams
  let query = ""
  let result: Awaited<ReturnType<typeof searchTrainingCenters>> | undefined
  let message: string | undefined
  try {
    const options = parseSearchParams(params)
    query = options.q
    result = await searchTrainingCenters(options)
  } catch (error) {
    message = error instanceof RequestError ? error.message : "훈련장을 불러오지 못했어요. 잠시 후 다시 시도해주세요."
  }
  return <TrainingCenterList centers={result?.items ?? []} query={query} pagination={result} error={message} />
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
