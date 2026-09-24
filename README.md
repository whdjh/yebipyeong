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
