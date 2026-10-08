import FreshLink from "./fresh-link"
import EvaluationAction from "./evaluation-action"
import Icon from "./icon"
import Pagination from "./pagination"
import type { TrainingCenterSummary } from "./training-center-list"

type EvaluationSummary = {
  id: string
  kind: string
  period: string
  answers: readonly { question: string, answer: string }[]
}

export default function TrainingCenterDetail({ center, evaluations, pagination }: {
  center: TrainingCenterSummary
  evaluations: readonly EvaluationSummary[]
  pagination: { page: number, limit: number, hasNext: boolean }
}) {
  return (
    <main className="page-shell detail-page">
      <FreshLink className="back-link" href="/"><Icon name="left" />훈련장 목록</FreshLink>
      <div className="detail-intro">
        <div className="detail-heading">
          <h1>{center.name}</h1>
          <p>{center.address}</p>
        </div>
        <EvaluationAction center={{ id: center.id, name: center.name, address: center.address }} />
      </div>

      <section className="evaluation-section" aria-labelledby="evaluation-title">
        <div className="section-heading">
          <h2 id="evaluation-title">훈련장 평가</h2>
          <span className="review-count">평가 <strong>{center.evaluationCount}</strong>개</span>
        </div>
        <dl className="recommend-summary">
          <div><dt>추천</dt><dd>{center.recommendedCount}<span>개</span></dd></div>
          <div><dt>비추천</dt><dd>{center.notRecommendedCount}<span>개</span></dd></div>
        </dl>

        {evaluations.length === 0 ? <div className="empty-state"><h3>{center.evaluationCount === 0 ? "아직 작성된 평가가 없어요" : "이 페이지에 평가가 없어요"}</h3><p>{center.evaluationCount === 0 ? "훈련 경험을 첫 번째로 남겨주세요." : "이전 페이지에서 평가를 확인해주세요."}</p></div> : evaluations.map((evaluation) => <article className="evaluation-card" key={evaluation.id}>
          <div className="evaluation-meta"><span className="kind-badge">{evaluation.kind}</span><span>{evaluation.period}</span></div>
          <dl className="evaluation-answers">
            {evaluation.answers.map((item, index) => (
              <div key={`${index}-${item.question}`}>
                <dt>{item.question}</dt>
                <dd className={item.answer === "추천해요." ? "recommended-answer" : undefined}>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </article>)}
        <Pagination path={`/training-centers/${center.id}`} {...pagination} />
      </section>
    </main>
  )
}
