"use client"

import { useEffect, useRef, useState } from "react"
import { actionButton } from "@seed-design/css/recipes/action-button"
import { trainingKinds, type TrainingKind } from "../_data/evaluation-questions"
import Icon from "./icon"

export default function EvaluationDialog({ center, onClose }: {
  center: { name: string, address: string }
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<"info" | "questions">("info")
  const [venue, setVenue] = useState(center.name)
  const [kind, setKind] = useState<TrainingKind | "">("")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [saveUnavailable, setSaveUnavailable] = useState(false)
  const selectedKind = kind ? trainingKinds[kind] : undefined
  const infoComplete = venue === center.name && !!kind && !!year && !!month
  const allAnswered = selectedKind?.questions.every((item) => answers[item.label] !== undefined) ?? false

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  function changeStep(nextStep: "info" | "questions") {
    setStep(nextStep)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }

  return (
      <dialog className="evaluation-dialog" ref={dialogRef} aria-labelledby="dialog-title" aria-describedby="dialog-description" onClose={(event) => {
        if (!event.currentTarget.open) onClose()
      }}>
        <form className="evaluation-form" onSubmit={(event) => {
          event.preventDefault()
          if (!infoComplete) return
          if (step === "info") changeStep("questions")
          else if (allAnswered) setSaveUnavailable(true)
        }}>
          <div className="dialog-top">
            <span className="step-label"><span className="step-current">{step === "info" ? "01" : "02"}</span><span className="step-divider">/</span>02<span className="step-name">{step === "info" ? "훈련 정보" : "훈련 평가"}</span></span>
            <button className="icon-button" type="button" aria-label="평가 작성 닫기" onClick={() => dialogRef.current?.close()}><Icon name="close" /></button>
          </div>
          <div className="dialog-scroll" ref={scrollRef}>
            {step === "questions" && <button className="text-button edit-info" type="button" onClick={() => changeStep("info")}><Icon name="left" width="16" height="16" />훈련 정보 수정</button>}
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
                    <input id="evaluation-venue" value={venue} onChange={(event) => setVenue(event.target.value)} list="evaluation-venues" placeholder="훈련장명 또는 주소" autoComplete="off" required />
                    {venue === center.name && <Icon name="check" className="venue-check" />}
                  </div>
                  <datalist id="evaluation-venues"><option value={center.name}>{center.address}</option></datalist>
                  <p className="field-hint">{venue === center.name ? center.address : "목록에서 훈련장을 선택해주세요."}</p>
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
                    <label><span className="select-label">연도</span><select required value={year} onChange={(event) => setYear(event.target.value)}><option value="">연도 선택</option>{[2026, 2025, 2024].map((value) => <option key={value} value={value}>{value}년</option>)}</select></label>
                    <label><span className="select-label">월</span><select required value={month} onChange={(event) => setMonth(event.target.value)}><option value="">월 선택</option>{Array.from({ length: 12 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value}월</option>)}</select></label>
                  </div>
                </fieldset>
              </div>
            ) : (
              <div className="question-fields">
                {selectedKind?.questions.map((item, index) => (
                  <fieldset className="question-field" key={item.label}>
                    <legend><span className="question-caption">{String(index + 1).padStart(2, "0")} · {item.label}</span>{item.question}</legend>
                    <div className="answer-choices">
                      {item.options.map((option) => (
                        <label className="answer-choice" key={option}>
                          <input type="radio" name={item.label} value={option} required checked={answers[item.label] === option} onChange={() => {
                            setAnswers({ ...answers, [item.label]: option })
                            setSaveUnavailable(false)
                          }} />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
          </div>
          <div className="dialog-footer">
            {saveUnavailable && <p className="completion-note" role="status">평가 저장 기능이 아직 연결되지 않았어요.</p>}
            <button className={`${actionButton({ size: "large", variant: "neutralSolid" })} primary-button`} type="submit" disabled={!infoComplete || (step === "questions" && !allAnswered)}>{step === "info" ? "다음" : "완료"}{step === "info" && <Icon name="right" width="16" height="16" />}</button>
          </div>
        </form>
      </dialog>
  )
}
