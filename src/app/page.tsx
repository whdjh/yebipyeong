import TrainingCenterList from "./_components/training-center-list"

export default function Home() {
  return (
    <main className="page-shell list-page">
      <div className="page-intro">
        <h1>어디에서<br className="mobile-break" /> 훈련받으셨나요?</h1>
        <p>다른 예비군이 경험한 훈련장 운영을 확인해보세요.</p>
      </div>
      <TrainingCenterList />
    </main>
  )
}
