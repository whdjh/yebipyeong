import { revalidatePath } from "next/cache"
import { createEvaluation } from "@/lib/evaluations"
import { errorResponse, readJsonBody } from "@/lib/http"

export async function POST(request: Request) {
  try {
    const saved = await createEvaluation(await readJsonBody(request))
    revalidatePath("/")
    revalidatePath(`/training-centers/${saved.trainingCenterId}`)
    return Response.json({ id: saved.id }, { status: 201, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return errorResponse(error)
  }
}
