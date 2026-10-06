import type { SVGProps } from "react"

const paths = {
  search: "m20 20-4.5-4.5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  left: "m14 6-6 6 6 6 M8 12h13",
  right: "m9 5 7 7-7 7",
  close: "m6 6 12 12 M18 6 6 18",
  check: "m5 12 4 4L19 6",
}

export default function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={paths[name]} />
    </svg>
  )
}
