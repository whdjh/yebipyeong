export class RequestError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof RequestError) {
    return Response.json({ error: { code: error.code, message: error.message } }, {
      status: error.status,
      headers: { "Cache-Control": "no-store" },
    })
  }
  return Response.json({ error: { code: "SERVER_ERROR", message: "잠시 후 다시 시도해주세요." } }, {
    status: 500,
    headers: { "Cache-Control": "no-store" },
  })
}

export async function readJsonBody(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new RequestError(415, "UNSUPPORTED_MEDIA_TYPE", "JSON 형식으로 제출해주세요.")
  }

  const maxBytes = 8192
  const tooLarge = () => new RequestError(413, "BODY_TOO_LARGE", "제출 내용이 너무 커요.")
  if (Number(request.headers.get("content-length")) > maxBytes) throw tooLarge()

  const reader = request.body?.getReader()
  if (!reader) throw new RequestError(400, "INVALID_INPUT", "입력한 훈련 정보를 확인해주세요.")
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) {
        await reader.cancel()
        throw tooLarge()
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body))
  } catch {
    throw new RequestError(400, "INVALID_INPUT", "입력한 훈련 정보를 확인해주세요.")
  }
}
