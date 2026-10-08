import { hasValidAnswers, isTrainingKind } from "../app/_data/evaluation-questions"
import { RequestError } from "./http"

export const isUuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

function invalidInput(): never {
  throw new RequestError(400, "INVALID_INPUT", "입력한 훈련 정보를 확인해주세요.")
}

export function validateEvaluation(body: unknown, now = new Date()) {
  if (!body || typeof body !== "object" || Array.isArray(body)) invalidInput()
  const fields = body as Record<string, unknown>
  const allowed = ["trainingCenterId", "kind", "year", "month", "answers"]
  if (Object.keys(fields).length !== allowed.length || !allowed.every((key) => Object.hasOwn(fields, key))) invalidInput()
  const { trainingCenterId, kind, year, month, answers } = fields
  if (!isUuid(trainingCenterId) || !isTrainingKind(kind)) invalidInput()
  if (typeof year !== "number" || !Number.isInteger(year) || year < 1 || year > 9999) invalidInput()
  if (typeof month !== "number" || !Number.isInteger(month) || month < 1 || month > 12) invalidInput()
  const koreaNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  if (year * 12 + month > koreaNow.getUTCFullYear() * 12 + koreaNow.getUTCMonth() + 1) invalidInput()
  if (!hasValidAnswers(kind, answers)) invalidInput()
  return { trainingCenterId, kind, year, month, answers: { ...answers } }
}

export function parseSearchParams(params: Record<string, string | string[] | undefined>) {
  const invalid = () => new RequestError(400, "INVALID_INPUT", "검색 조건을 확인해주세요.")
  if (Object.keys(params).some((key) => !["q", "page", "limit"].includes(key))) throw invalid()
  if (Object.values(params).some((value) => Array.isArray(value))) throw invalid()
  const q = (params.q as string | undefined)?.trim().normalize("NFC") ?? ""
  if (q.length > 200 || /[\u0000-\u001f\u007f]/.test(q)) throw invalid()
  function integer(value: string | string[] | undefined, fallback: number, max: number) {
    if (value === undefined) return fallback
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) throw invalid()
    const parsed = Number(value)
    if (!Number.isSafeInteger(parsed) || parsed > max) throw invalid()
    return parsed
  }
  const page = integer(params.page, 1, 2147483647)
  const limit = integer(params.limit, 20, 50)
  if ((page - 1) * limit > 2147483647) throw invalid()
  return { q, page, limit }
}
