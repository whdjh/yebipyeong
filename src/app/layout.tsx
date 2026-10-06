import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "예비평", template: "%s · 예비평" },
  description: "예비군 훈련장 운영 경험을 익명 객관식 평가로 확인하세요.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" data-seed="" data-seed-color-mode="light-only">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body>{children}</body>
    </html>
  )
}
