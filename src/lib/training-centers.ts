import "server-only"

import { cache } from "react"
import type { TrainingCenterSummary } from "@/app/_components/training-center-list"
import { hasValidAnswers, isTrainingKind, trainingKinds } from "@/app/_data/evaluation-questions"
import { RequestError } from "./http"
import { getSupabase } from "./supabase/server"
import { isUuid } from "./validation"

type CenterRow = {
  id: string
  name: string | null
  address: string
  evaluation_count: number
  recommended_count: number
  not_recommended_count: number
}

function summary(row: CenterRow): TrainingCenterSummary {
  return {
    id: row.id,
    name: row.name ?? row.address,
    address: row.address,
    evaluationCount: Number(row.evaluation_count),
    recommendedCount: Number(row.recommended_count),
    notRecommendedCount: Number(row.not_recommended_count),
  }
}

export async function searchTrainingCenters({ q, page, limit }: { q: string, page: number, limit: number }) {
  const { data, error } = await getSupabase().rpc("yebipyeong_search_training_centers", {
    search_query: q, page_number: page, page_size: limit,
  })
  if (error || !data) throw new RequestError(503, "DATABASE_UNAVAILABLE", "훈련장을 불러오지 못했어요. 잠시 후 다시 시도해주세요.")
  const rows = data as CenterRow[]
  return { items: rows.slice(0, limit).map(summary), page, limit, hasNext: rows.length > limit }
}

export const getTrainingCenter = cache(async (id: string) => {
  if (!isUuid(id)) return null
  const { data, error } = await getSupabase().rpc("yebipyeong_search_training_centers", { center_id: id })
  if (error || !data) throw new RequestError(503, "DATABASE_UNAVAILABLE", "훈련장을 불러오지 못했어요. 잠시 후 다시 시도해주세요.")
  return data.length ? summary(data[0] as CenterRow) : null
})

export async function getEvaluations(centerId: string, page: number, limit: number) {
  const offset = (page - 1) * limit
  const { data, error } = await getSupabase().from("yebipyeong_evaluations")
    .select("id,kind,year,month,answers")
    .eq("training_center_id", centerId)
    .order("created_at", { ascending: false }).order("id", { ascending: false })
    .range(offset, offset + limit)
  if (error || !data) throw new RequestError(503, "DATABASE_UNAVAILABLE", "평가를 불러오지 못했어요. 잠시 후 다시 시도해주세요.")
  const items = data.slice(0, limit).map((row) => {
    if (!isTrainingKind(row.kind) || !hasValidAnswers(row.kind, row.answers)) {
      throw new RequestError(503, "DATABASE_UNAVAILABLE", "평가를 불러오지 못했어요.")
    }
    const definition = trainingKinds[row.kind]
    const answers = row.answers as Record<string, string>
    return {
      id: row.id as string,
      kind: definition.label,
      period: `${row.year}년 ${row.month}월`,
      answers: definition.questions.map((question) => ({
        question: question.question,
        answer: question.options.find((option) => option.value === answers[question.id])!.label,
      })),
    }
  })
  return { items, page, limit, hasNext: data.length > limit }
}
