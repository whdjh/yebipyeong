import type { Metadata } from "next"
import Link from "next/link"
import { previewCenter, trainingKinds } from "../../_data/preview"
import EvaluationDialog from "../../_components/evaluation-dialog"
import Icon from "../../_components/icon"

export const metadata: Metadata = { title: "OO동원훈련장" }

export default function TrainingCenterPage() {
  return (
    <main className="page-shell detail-page">
      <Link className="back-link" href="/"><Icon name="left" />훈련장 목록</Link>
      <div className="detail-intro">
        <div className="detail-heading">
          <h1>{previewCenter.name}</h1>
          <p>{previewCenter.address}</p>
        </div>
        <EvaluationDialog />
      </div>

      <section className="evaluation-section" aria-labelledby="evaluation-title">
        <div className="section-heading">
          <h2 id="evaluation-title">훈련장 평가</h2>
          <span className="review-count">평가 <strong>{previewCenter.evaluations}</strong>개</span>
        </div>
        <dl className="recommend-summary">
          <div><dt>추천</dt><dd>{previewCenter.recommended}<span>개</span></dd></div>
          <div><dt>비추천</dt><dd>{previewCenter.notRecommended}<span>개</span></dd></div>
        </dl>

        <article className="evaluation-card" aria-label="작계훈련 평가 예시">
          <div className="evaluation-meta"><span className="kind-badge">작계훈련</span><time dateTime="2026-09">2026년 9월</time></div>
          <dl className="evaluation-answers">
            {trainingKinds.operation.questions.map((item, index) => (
              <div key={item.label}>
                <dt>{item.question}</dt>
                <dd className={index === 1 ? "recommended-answer" : undefined}>{index === 0 ? "안 했어요." : "추천해요."}</dd>
              </div>
            ))}
          </dl>
        </article>
      </section>
      <p className="preview-note">화면에 표시된 훈련장과 평가는 예시입니다.</p>
    </main>
  )
}
