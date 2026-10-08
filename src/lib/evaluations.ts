import "server-only"

import { RequestError } from "./http"
import { getSupabase } from "./supabase/server"
import { validateEvaluation } from "./validation"

export async function createEvaluation(body: unknown) {
  const value = validateEvaluation(body)
  const db = getSupabase()
  const { data: center, error: lookupError } = await db.from("yebipyeong_training_centers").select("id").eq("id", value.trainingCenterId).maybeSingle()
  if (lookupError) throw new RequestError(503, "DATABASE_UNAVAILABLE", "평가를 저장하지 못했어요. 잠시 후 다시 시도해주세요.")
  if (!center) throw new RequestError(404, "CENTER_NOT_FOUND", "선택한 훈련장을 찾을 수 없어요.")
  const { data, error } = await db.from("yebipyeong_evaluations").insert({
    training_center_id: value.trainingCenterId,
    kind: value.kind,
    year: value.year,
    month: value.month,
    answers: value.answers,
  }).select("id").single()
  if (error?.code === "23503") throw new RequestError(404, "CENTER_NOT_FOUND", "선택한 훈련장을 찾을 수 없어요.")
  if (error || !data) throw new RequestError(503, "DATABASE_UNAVAILABLE", "저장 결과를 확인하지 못했어요. 상세에서 평가를 확인한 뒤 다시 시도해주세요.")
  return { id: data.id as string, trainingCenterId: value.trainingCenterId }
}
