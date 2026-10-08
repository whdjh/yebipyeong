import "server-only"

import { createClient } from "@supabase/supabase-js"
import { RequestError } from "../http"

export function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    throw new RequestError(500, "SERVER_CONFIGURATION", "서버 데이터 연결 설정을 확인해주세요.")
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) => fetch(input, {
        ...init,
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }),
    },
  })
}
