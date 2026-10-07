# 예비평

예비군 훈련장 운영 경험을 익명 객관식 평가로 공유하는 서비스입니다.

서비스 요구사항과 현재 범위는 [docs/plan.md](docs/plan.md)를 기준으로 합니다.

## 기술 스택

- Next.js App Router, TypeScript
- Tailwind CSS 4, Seed Design
- Supabase

## 시작하기

```bash
npm install
npm run dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 명령어

```bash
npm run dev    # 개발 서버
npm run build  # 프로덕션 빌드
npm run start  # 프로덕션 서버
npm run lint   # ESLint
```

## 주요 경로

- `src/app`: App Router 앱 코드
- `src/seed-design`: Seed Design CLI로 추가하는 컴포넌트 경로
- `docs/plan.md`: 서비스 요구사항

## 현재 화면

- `/`: 훈련장 목록과 검색. 실제 데이터 조회 연결 전에는 빈 목록을 표시합니다.

HTML 목업, 예시 훈련장·평가 데이터, `sample` 상세 경로는 제거했습니다.
상세 화면은 `training-center-detail.tsx`에 실제 표시 데이터를 받는 서버 컴포넌트로 유지합니다.
실제 상세 경로와 평가 저장은 데이터 연결 단계에서 구성합니다. 라이트 모드만 지원합니다.

## 렌더링

- 목록과 상세 정보는 서버 컴포넌트에서 렌더링합니다.
- 검색은 `next/form`으로 URL의 `q`를 전송하고 서버에서 읽습니다. 입력마다 요청하지 않고 검색 버튼이나 Enter로 실행합니다.
- 검색 영역은 Suspense로 분리해 제목 등 정적인 HTML을 먼저 보냅니다.
- 평가 작성 버튼만 클라이언트에서 동작하고, 폼과 평가 문항은 작성 버튼을 누를 때 불러옵니다.
- 버튼은 Seed Design CSS recipe와 기본 HTML 버튼을 사용해 React 컴포넌트 내부 훅의 로딩을 줄입니다.
