// docs/plan.md에 정의된 실제 평가 문항과 선택지.
const exitOptions = ["조기 퇴소했어요.", "안내된 시간에 맞춰 퇴소했어요.", "안내된 시간보다 늦게 퇴소했어요."]
const recommendOptions = ["추천해요.", "추천하지 않아요."]
const recommendPlace = { label: "추천 여부", question: "이 훈련장을 다른 예비군에게 추천하시나요?", options: recommendOptions }

export const trainingKinds = {
  mobilization: {
    label: "동원훈련",
    questions: [
      { label: "훈련 일정", question: "훈련은 어떻게 진행됐나요?", options: ["1~2일차에 주요 훈련을 집중해서 진행했어요.", "3일 동안 비교적 나눠서 진행했어요."] },
      { label: "아침점호", question: "아침점호를 했나요?", options: ["했어요.", "안 했어요."] },
      { label: "퇴소", question: "퇴소는 어떻게 진행됐나요?", options: exitOptions },
      { label: "복장 규정", question: "복장 규정은 어느 정도로 확인했나요?", options: ["거의 확인하지 않았어요.", "기본적인 복장만 확인했어요.", "고무링·전투모 등 세부 항목까지 엄격하게 확인했어요."] },
      { label: "불침번", question: "불침번이 있었나요?", options: ["있었어요.", "없었어요."] },
      { label: "훈련 진행 정도", question: "훈련은 어떻게 진행됐나요?", options: ["계획보다 과하게 진행됐어요.", "계획대로 진행됐어요.", "일부 축소해서 진행됐어요."] },
      recommendPlace,
    ],
  },
  commuting: {
    label: "동미참훈련",
    questions: [
      { label: "훈련 구성", question: "훈련은 어떻게 진행됐나요?", options: ["4일 동안 서로 다른 훈련을 나눠서 진행했어요.", "비슷한 훈련을 반복해서 진행했어요."] },
      { label: "퇴소", question: "퇴소는 어떻게 진행됐나요?", options: exitOptions },
      recommendPlace,
    ],
  },
  operation: {
    label: "작계훈련",
    questions: [
      { label: "산길 및 경사지 이동", question: "훈련 중 산길이나 경사진 곳을 이동했나요?", options: ["했어요.", "안 했어요."] },
      { label: "추천 여부", question: "이 훈련을 다른 예비군에게 추천하시나요?", options: recommendOptions },
    ],
  },
}

export type TrainingKind = keyof typeof trainingKinds
