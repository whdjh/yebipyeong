# 예비평

예비군 훈련장 운영 경험을 익명 객관식 평가로 공유합니다.

## 실행

```bash
npm install
npm run dev
```

프로젝트 루트 `.env.local`에 서버 전용 환경변수를 설정합니다. 키 값은 Git·문서·채팅에 넣지 않습니다.

```dotenv
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=<server-secret-key>
```

환경변수 변경 후 서버를 재시작합니다. Vercel에도 같은 이름으로 등록하며 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.

## DB

Supabase DB 연동과 초기 주소 입력은 완료됐습니다. 모든 앱 DB 객체는 `yebipyeong_` 접두사를 사용합니다.
초기 훈련장은 사용자가 실제 방문한 이천 주소와 운학동 동원훈련장입니다. 평가를 초기 자료로 만들지 않습니다.

## 화면과 API

- `/`: 훈련장명·주소·별칭 검색.
- `/training-centers/{id}`: 실제 훈련장 정보·최신 평가·추천 및 비추천 건수.
- `GET /api/training-centers?q=...&page=1&limit=20`: `{ items, page, limit, hasNext }`.
- `POST /api/evaluations`: `{ trainingCenterId, kind, year, month, answers }`를 받아 `201 { id }` 반환.

목록·평가는 기본 20개, 상한 50개씩 페이지네이션합니다. 문항과 선택지 코드는 [evaluation-questions.ts](src/app/_data/evaluation-questions.ts)를 UI와 서버 검증에서 공유합니다.
DB는 Next.js 서버에서 요청 시 조회합니다. 저장 실패 시 입력을 유지하고 자동 재전송하지 않으며, 성공 후 상세와 목록을 갱신합니다.

## 익명성

로그인·작성자 정보·추적 쿠키·분석 도구·중복 작성 제한·사용자 수정 및 삭제 기능이 없습니다.
API는 정해진 객관식 값만 받습니다. 요청 헤더·IP·제출 본문을 로그에 기록하지 않고, 방문자의 요청 헤더를 Supabase에 전달하지 않습니다.
RLS와 권한 설정으로 브라우저의 DB 직접 접근을 막으며, 서버 키는 서버 전용 모듈에서만 사용합니다.
호스팅·Supabase의 자동 접속 로그 수집·보존 여부는 배포 환경에서 별도로 확인해야 합니다.

## 검증

```bash
npm run lint
npm run build
```

실제 주소 검색·상세·평가 저장·집계 갱신과 제출 실패 시 입력 유지를 프로덕션 서버에서 확인했습니다.
