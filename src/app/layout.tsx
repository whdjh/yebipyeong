import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "yebipyeong",
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
