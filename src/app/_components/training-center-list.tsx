"use client"

import { useState } from "react"
import Link from "next/link"
import { previewCenter } from "../_data/preview"
import Icon from "./icon"

export default function TrainingCenterList() {
  const [query, setQuery] = useState("")
  const normalizedQuery = query.replace(/\s/g, "").toLowerCase()
  const matches = [previewCenter.name, previewCenter.address, ...previewCenter.aliases]
    .some((value) => value.replace(/\s/g, "").toLowerCase().includes(normalizedQuery))

  return (
    <>
      <section className="search-section" aria-label="훈련장 검색">
        <label className="field-label" htmlFor="center-search">훈련장명 또는 주소</label>
        <div className="search-field">
          <Icon name="search" />
          <input id="center-search" type="search" placeholder="안내받은 훈련장명 또는 주소를 입력해주세요." value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" aria-describedby="search-hint" />
        </div>
        <p className="field-hint" id="search-hint">알림톡이나 소집통지서에 적힌 내용을 그대로 입력해도 돼요.</p>
      </section>

      <section className="results-section" aria-labelledby="results-title">
        <div className="section-heading">
          <h2 id="results-title">훈련장 목록</h2>
          <span className="result-count" aria-live="polite">{matches ? "1곳" : "0곳"}</span>
        </div>
        {matches ? (
          <Link className="center-card" href="/training-centers/sample">
            <div className="center-card-name">
              <h3>{previewCenter.name}</h3>
              <p>{previewCenter.address}</p>
            </div>
            <div className="center-card-stats">
              <span className="review-count">평가 <strong>{previewCenter.evaluations}</strong>개</span>
              <span className="recommend-pair"><span>추천 <strong>{previewCenter.recommended}</strong></span><span className="ratio-colon">:</span><span>비추천 <strong>{previewCenter.notRecommended}</strong></span></span>
            </div>
            <Icon className="card-arrow" name="right" />
          </Link>
        ) : (
          <div className="empty-state" role="status">
            <Icon name="search" width="28" height="28" />
            <h3>검색 결과가 없어요</h3>
            <p>훈련장명이나 주소를 다시 확인해주세요.</p>
            <button type="button" className="text-button" onClick={() => setQuery("")}>전체 목록 보기 <Icon name="right" width="16" height="16" /></button>
          </div>
        )}
      </section>
      <p className="preview-note">화면에 표시된 훈련장과 평가는 예시입니다.</p>
    </>
  )
}
