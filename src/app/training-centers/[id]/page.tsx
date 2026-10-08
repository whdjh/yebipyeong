import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getEvaluations, getTrainingCenter } from "@/lib/training-centers"
import { parseSearchParams } from "@/lib/validation"
import TrainingCenterDetail from "@/app/_components/training-center-detail"

type Props = PageProps<"/training-centers/[id]">

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const center = await getTrainingCenter(id)
  if (!center) notFound()
  return { title: center.name }
}

async function Detail({ params, searchParams }: Props) {
  const { id } = await params
  const center = await getTrainingCenter(id)
  if (!center) notFound()
  const { page, limit } = parseSearchParams(await searchParams)
  const evaluations = await getEvaluations(id, page, limit)
  return <TrainingCenterDetail center={center} evaluations={evaluations.items} pagination={evaluations} />
}

export default function Page(props: Props) {
  return <Suspense fallback={<main className="page-shell detail-page"><p role="status">훈련장과 평가를 불러오고 있어요.</p></main>}><Detail {...props} /></Suspense>
}
