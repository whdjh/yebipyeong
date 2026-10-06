"use client"

import { useRef, useState } from "react"
import { ActionButton } from "@seed-design/react"
import { previewCenter, trainingKinds, type TrainingKind } from "../_data/preview"
import Icon from "./icon"

export default function EvaluationDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<"info" | "questions">("info")
  const [venue, setVenue] = useState(previewCenter.name)
  const [kind, setKind] = useState<TrainingKind | "">("")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [previewComplete, setPreviewComplete] = useState(false)
  const selectedKind = kind ? trainingKinds[kind] : undefined
  const infoComplete = venue === previewCenter.name && !!kind && !!year && !!month
  const allAnswered = selectedKind?.questions.every((item) => answers[item.label] !== undefined) ?? false

  function openDialog() {
    setStep("info")
    setPreviewComplete(false)
    dialogRef.current?.showModal()
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }

  function changeStep(nextStep: "info" | "questions") {
    setStep(nextStep)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }

  return (
    <>
      <div className="detail-action">
        <div className="detail-action-inner"><ActionButton size="large" variant="neutralSolid" className="primary-button" onClick={openDialog}>평가 작성</ActionButton></div>
      </div>
      <dialog className="evaluation-dialog" ref={dialogRef} aria-labelledby="dialog-title" aria-describedby="dialog-description" onClose={() => setPreviewComplete(false)}>
        <form className="evaluation-form" onSubmit={(event) => {
          event.preventDefault()
          if (!infoComplete) return
          if (step === "info") changeStep("questions")
          else if (allAnswered) setPreviewComplete(true)
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
                    <input id="evaluation-venue" value={venue} onChange={(event) => setVenue(event.target.value)} list="preview-venues" placeholder="훈련장명 또는 주소" autoComplete="off" required />
                    {venue === previewCenter.name && <Icon name="check" className="venue-check" />}
                  </div>
                  <datalist id="preview-venues"><option value={previewCenter.name}>{previewCenter.address}</option></datalist>
                  <p className="field-hint">{venue === previewCenter.name ? previewCenter.address : "목록에서 훈련장을 선택해주세요."}</p>
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
                            setPreviewComplete(false)
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
            {previewComplete && <p className="completion-note" role="status">화면 미리보기로, 평가는 저장되지 않아요.</p>}
            <ActionButton size="large" variant="neutralSolid" className="primary-button" type="submit" disabled={!infoComplete || (step === "questions" && !allAnswered)}>{step === "info" ? "다음" : "완료"}{step === "info" && <Icon name="right" width="16" height="16" />}</ActionButton>
          </div>
        </form>
      </dialog>
    </>
  )
}
