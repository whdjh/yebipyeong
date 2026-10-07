"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { actionButton } from "@seed-design/css/recipes/action-button"

const EvaluationDialog = dynamic(() => import("./evaluation-dialog"), {
  ssr: false,
  loading: () => <p className="dialog-loading" role="status">작성창을 불러오고 있어요.</p>,
})

export default function EvaluationAction({ center }: { center: { name: string, address: string } }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="detail-action">
        <div className="detail-action-inner">
          <button className={`${actionButton({ size: "large", variant: "neutralSolid" })} primary-button`} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>평가 작성</button>
        </div>
      </div>
      {open && <EvaluationDialog center={center} onClose={() => setOpen(false)} />}
    </>
  )
}
