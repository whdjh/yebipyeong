"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { actionButton } from "@seed-design/css/recipes/action-button"
import { hasValidAnswers, trainingKinds, type TrainingKind } from "../_data/evaluation-questions"
import Icon from "./icon"
import type { TrainingCenterSummary } from "./training-center-list"

export default function EvaluationDialog({ center, onClose }: {
  center: { id: string, name: string, address: string }
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const postingRef = useRef(false)
  const searchRequestRef = useRef<AbortController | null>(null)
  const [step, setStep] = useState<"info" | "questions">("info")
  const [venue, setVenue] = useState(center.name)
  const [selectedCenter, setSelectedCenter] = useState<typeof center | null>(center)
  const [searchResults, setSearchResults] = useState<TrainingCenterSummary[]>([])
  const [searchPage, setSearchPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [kind, setKind] = useState<TrainingKind | "">("")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const selectedKind = kind ? trainingKinds[kind] : undefined
  const [koreaNow] = useState(() => new Date(Date.now() + 9 * 60 * 60 * 1000))
  const latestPeriod = koreaNow.getUTCFullYear() * 12 + koreaNow.getUTCMonth() + 1
  const infoComplete = !!selectedCenter && !!kind && Number.isSafeInteger(Number(year)) && Number(year) > 0 && Number(month) >= 1 && Number(month) <= 12 && Number(year) * 12 + Number(month) <= latestPeriod
  const allAnswered = kind ? hasValidAnswers(kind, answers) : false

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  useEffect(() => {
    if (selectedCenter) return
    const controller = new AbortController()
    searchRequestRef.current = controller
    const timer = setTimeout(async () => {
      setSearchLoading(true)
      setSearchError("")
      try {
        const params = new URLSearchParams({ q: venue, page: String(searchPage), limit: "20" })
        const response = await fetch(`/api/training-centers?${params}`, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]), credentials: "omit", cache: "no-store" })
        const body = await response.json()
        if (!response.ok) throw new Error(body.error?.message ?? "훈련장을 불러오지 못했어요.")
        if (!controller.signal.aborted) {
          setSearchResults(body.items)
          setHasNext(body.hasNext)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchError(error instanceof Error && !(error instanceof TypeError) && !(error instanceof DOMException) ? error.message : "훈련장을 불러오지 못했어요. 다시 검색해주세요.")
          setSearchResults([])
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false)
      }
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [venue, selectedCenter, searchPage])

  async function submitEvaluation() {
    if (!infoComplete || !allAnswered || !selectedCenter || postingRef.current) return
    postingRef.current = true
    setSubmitting(true)
    setSubmitError("")
    try {
      const response = await fetch("/api/evaluations", {
        method: "POST", credentials: "omit", headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({ trainingCenterId: selectedCenter.id, kind, year: Number(year), month: Number(month), answers }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error?.message ?? "평가를 저장하지 못했어요.")
      if (typeof body.id !== "string") throw new Error("저장 결과를 확인하지 못했어요. 상세에서 평가를 확인해주세요.")
      onClose()
      router.replace(`/training-centers/${selectedCenter.id}`)
      router.refresh()
    } catch (error) {
      setSubmitError(error instanceof Error && !(error instanceof TypeError) && !(error instanceof DOMException) ? error.message : "저장 결과를 확인하지 못했어요. 상세에서 평가를 확인한 뒤 다시 시도해주세요.")
    } finally {
      postingRef.current = false
      setSubmitting(false)
    }
  }

  function changeStep(nextStep: "info" | "questions") {
    setStep(nextStep)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }

  return (
      <dialog className="evaluation-dialog" ref={dialogRef} aria-labelledby="dialog-title" aria-describedby="dialog-description" onClose={(event) => {
        if (!event.currentTarget.open) onClose()
      }} onCancel={(event) => { if (postingRef.current) event.preventDefault() }}>
        <form className="evaluation-form" onSubmit={(event) => {
          event.preventDefault()
          if (!infoComplete) return
          if (step === "info") changeStep("questions")
          else if (allAnswered) void submitEvaluation()
        }}>
          <div className="dialog-top">
            <span className="step-label"><span className="step-current">{step === "info" ? "01" : "02"}</span><span className="step-divider">/</span>02<span className="step-name">{step === "info" ? "훈련 정보" : "훈련 평가"}</span></span>
            <button className="icon-button" type="button" aria-label="평가 작성 닫기" disabled={submitting} onClick={() => dialogRef.current?.close()}><Icon name="close" /></button>
          </div>
          <div className="dialog-scroll" ref={scrollRef}>
            {step === "questions" && <button className="text-button edit-info" type="button" disabled={submitting} onClick={() => changeStep("info")}><Icon name="left" width="16" height="16" />훈련 정보 수정</button>}
            <div className="dialog-intro">
              <h2 id="dialog-title">{step === "info" ? "훈련 정보를 알려주세요" : "훈련은 어땠나요?"}</h2>
              <p id="dialog-description">{step === "info" ? "이름이나 개인정보 없이 작성할 수 있어요." : `${selectedKind?.label} · ${year}년 ${month}월`}</p>
            </div>

            {step === "info" ? (
              <div className="info-fields">
                <div className="venue-field">
                  <label className="field-label" htmlFor="evaluation-venue">훈련장</label>
                  <div className="search-field compact">
                    <Icon name="search" />
                    <input id="evaluation-venue" value={venue} maxLength={200} onChange={(event) => {
                      searchRequestRef.current?.abort()
                      setVenue(event.target.value)
                      setSelectedCenter(null)
                      setSearchResults([])
                      setHasNext(false)
                      setSearchError("")
                      setSearchLoading(true)
                      setSearchPage(1)
                    }} placeholder="훈련장명 또는 주소" autoComplete="off" required aria-describedby="venue-hint" />
                    {selectedCenter && <Icon name="check" className="venue-check" />}
                  </div>
                  <p className="field-hint" id="venue-hint">{selectedCenter ? selectedCenter.address : "검색 결과에서 훈련장을 선택해주세요."}</p>
                  {!selectedCenter && <div className="venue-results" aria-label="훈련장 검색 결과" aria-busy={searchLoading}>
                    {searchError ? <p role="alert">{searchError}</p> : searchLoading ? <p role="status">검색하고 있어요.</p> : searchResults.length === 0 ? <p role="status">검색 결과가 없어요.</p> : searchResults.map((item) => <button className="venue-result" type="button" key={item.id} onClick={() => {
                      searchRequestRef.current?.abort()
                      setSelectedCenter(item)
                      setVenue(item.name)
                      setSubmitError("")
                    }}>{item.name}<span>{item.address}</span></button>)}
                    {(searchPage > 1 || hasNext) && <div className="pagination"><button className="text-button" type="button" disabled={searchPage === 1 || searchLoading} onClick={() => setSearchPage(searchPage - 1)}>이전</button><span>{searchPage}페이지</span><button className="text-button" type="button" disabled={!hasNext || searchLoading} onClick={() => setSearchPage(searchPage + 1)}>다음</button></div>}
                  </div>}
                </div>
                <fieldset>
                  <legend>훈련 종류</legend>
                  <div className="kind-choices">
                    {(Object.keys(trainingKinds) as TrainingKind[]).map((value) => (
                      <label className="kind-choice" key={value}>
                        <input type="radio" name="kind" value={value} checked={kind === value} required onChange={() => {
                          setKind(value)
                          setAnswers({})
                        }} />
                        <span>{trainingKinds[value].label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>훈련 시기</legend>
                  <div className="period-fields">
                    <label><span className="select-label">연도</span><input type="number" inputMode="numeric" placeholder="훈련받은 연도" min="1" max={koreaNow.getUTCFullYear()} step="1" required value={year} onChange={(event) => setYear(event.target.value)} /></label>
                    <label><span className="select-label">월</span><select required value={month} onChange={(event) => setMonth(event.target.value)}><option value="">월 선택</option>{Array.from({ length: 12 }, (_, index) => index + 1).map((value) => <option key={value} value={value} disabled={Number(year) * 12 + value > latestPeriod}>{value}월</option>)}</select></label>
                  </div>
                </fieldset>
              </div>
            ) : (
              <div className="question-fields">
                {selectedKind?.questions.map((item, index) => (
                  <fieldset className="question-field" key={item.id} disabled={submitting}>
                    <legend><span className="question-caption">{String(index + 1).padStart(2, "0")} · {item.label}</span>{item.question}</legend>
                    <div className="answer-choices">
                      {item.options.map((option) => (
                        <label className="answer-choice" key={option.value}>
                          <input type="radio" name={item.id} value={option.value} required checked={answers[item.id] === option.value} onChange={() => {
                            setAnswers({ ...answers, [item.id]: option.value })
                            setSubmitError("")
                          }} />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
          </div>
          <div className="dialog-footer">
            {submitError && <p className="completion-note" role="alert">{submitError}</p>}
            <button className={`${actionButton({ size: "large", variant: "neutralSolid" })} primary-button`} type="submit" disabled={submitting || !infoComplete || (step === "questions" && !allAnswered)}>{submitting ? "저장 중…" : step === "info" ? "다음" : "완료"}{step === "info" && <Icon name="right" width="16" height="16" />}</button>
          </div>
        </form>
      </dialog>
  )
}
