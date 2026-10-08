import { errorResponse, RequestError } from "@/lib/http"
import { searchTrainingCenters } from "@/lib/training-centers"
import { parseSearchParams } from "@/lib/validation"

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams
    if ([...params.keys()].some((key) => params.getAll(key).length !== 1)) {
      throw new RequestError(400, "INVALID_INPUT", "검색 조건을 확인해주세요.")
    }
    const result = await searchTrainingCenters(parseSearchParams(Object.fromEntries(params)))
    return Response.json(result, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return errorResponse(error)
  }
}
