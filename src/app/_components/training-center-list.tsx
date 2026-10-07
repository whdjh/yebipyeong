import Form from "next/form"
import Link from "next/link"
import Icon from "./icon"

// 서버에서 렌더링할 목록의 표시 정보. DB 테이블 구조와는 별개다.
export type TrainingCenterSummary = {
  id: string
  name: string
  address: string
  evaluationCount: number
  recommendedCount: number
  notRecommendedCount: number
}

export default function TrainingCenterList({ centers, query = "", loading = false }: {
  centers: readonly TrainingCenterSummary[]
  query?: string
  loading?: boolean
}) {
  return (
    <>
      <section className="search-section" aria-label="훈련장 검색">
        <label className="field-label" htmlFor="center-search">훈련장명 또는 주소</label>
        <Form action="/" scroll={false}>
          <div className="search-field">
            <input key={query} id="center-search" name="q" type="search" placeholder="안내받은 훈련장명 또는 주소를 입력해주세요." defaultValue={query} autoComplete="off" aria-describedby="search-hint" enterKeyHint="search" />
            <button className="search-submit" type="submit" aria-label="훈련장 검색"><Icon name="search" /></button>
          </div>
        </Form>
        <p className="field-hint" id="search-hint">알림톡이나 소집통지서에 적힌 내용을 그대로 입력해도 돼요.</p>
      </section>

      <section className="results-section" aria-labelledby="results-title" aria-busy={loading}>
        <div className="section-heading">
          <h2 id="results-title">훈련장 목록</h2>
          <span className="result-count">{loading ? "" : `${centers.length}곳`}</span>
        </div>
        {loading ? <div className="empty-state" role="status"><p>훈련장을 불러오고 있어요.</p></div> : centers.length > 0 ? (
          <div className="center-list">
            {centers.map((center) => (
              <Link className="center-card" key={center.id} href={`/training-centers/${encodeURIComponent(center.id)}`}>
                <div className="center-card-name">
                  <h3>{center.name}</h3>
                  <p>{center.address}</p>
                </div>
                <div className="center-card-stats">
                  <span className="review-count">평가 <strong>{center.evaluationCount}</strong>개</span>
                  <span className="recommend-pair"><span>추천 <strong>{center.recommendedCount}</strong></span><span className="ratio-colon">:</span><span>비추천 <strong>{center.notRecommendedCount}</strong></span></span>
                </div>
                <Icon className="card-arrow" name="right" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state" role="status">
            <Icon name="search" width="28" height="28" />
            <h3>{query ? "검색 결과가 없어요" : "등록된 훈련장이 없어요"}</h3>
            <p>{query ? "훈련장명이나 주소를 다시 확인해주세요." : "훈련장이 등록되면 이곳에서 확인할 수 있어요."}</p>
            {query && <Link className="text-button" href="/" scroll={false}>전체 목록 보기 <Icon name="right" width="16" height="16" /></Link>}
          </div>
        )}
      </section>
    </>
  )
}
