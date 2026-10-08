"use client"

import Link from "next/link"
import type { ReactNode } from "react"

export default function FreshLink({ href, className, children }: { href: string, className: string, children: ReactNode }) {
  return <Link href={href} className={className} prefetch={false} onNavigate={(event) => {
    event.preventDefault()
    window.location.assign(href)
  }}>{children}</Link>
}
