<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 프로젝트 작업 규칙

## 기준 문서

- 작업 전 `docs/plan.md`를 확인하고 서비스 요구사항과 제외 범위를 따른다.
- 문서에서 미정으로 남긴 사항은 임의로 결정하거나 구현하지 않는다.

## 서비스 원칙

- 로그인 없이 익명으로 이용할 수 있게 한다.
- 이름, 연락처, 사용자 ID, IP, 기기 식별 정보 등 작성자를 알아볼 정보를 저장하거나 추적하지 않는다.
- 평가는 미리 정한 객관식 문항으로만 받는다. 자유서술, 개인 평가, 군사적으로 민감한 정보 수집은 추가하지 않는다.
- 데이터 구조나 Supabase 테이블은 요구사항과 명시적인 결정 없이 만들지 않는다.

## 개발 규칙

- Next.js App Router 코드는 `src/app`에 둔다. TypeScript와 npm을 사용한다.
- Seed Design 컴포넌트 스니펫은 `seed-design.json` 설정에 따라 `src/seed-design`에 두고 `seed-design/*` 경로로 가져온다.
- 세미콜론을 쓰지 않는다. 기존 ESLint 규칙을 유지하고 규칙이나 패키지를 불필요하게 늘리지 않는다.
- 변경에 맞게 `npm run lint`와 `npm run build`를 확인한다.
- 커밋 메시지는 `feat`, `chore`, `fix` 중 하나의 prefix와 한글 설명을 사용한다.
