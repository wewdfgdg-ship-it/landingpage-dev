# 자율 주행 마케팅 엔진 — 개발 규칙

## 프로젝트 개요
- 제품 정보 입력 → AI 12엔진 파이프라인 → 랜딩페이지 자동 생성 + 전환율 자동 최적화
- Next.js 16, TypeScript, Tailwind CSS v4, Zustand 5

## 수정 가능 경로
- `src/` — 모든 소스코드
- `prisma/` — DB 스키마
- `public/` — 정적 파일
- `scripts/` — Worker 스크립트
- `docs/` — 개발 문서

## 수정 금지 경로
- `.env`, `.env.local` — 환경변수 (직접 수정 금지)
- `next.config.ts` — Next.js 설정 (논의 후 수정)
- `package.json` — 의존성 (논의 후 수정)
- `tsconfig.json` — TS 설정 (논의 후 수정)
- `.github/` — CI/CD

## Import 규칙
- `@/*` → `src/*` (절대경로 필수)
- Prisma: `import { db } from "@/lib/db"`
- Auth: `import { auth } from "@/lib/auth"`
- Redis: `import { redis } from "@/lib/redis"`
- AI: `import { claude } from "@/lib/ai/claude"`, `import { gemini } from "@/lib/ai/gemini"`
- Utils: `import { ... } from "@/lib/utils"`
- 엔진: `import { ... } from "@/engine/01-product-intelligence"`

## 코딩 규칙
- TypeScript strict mode
- 모든 함수에 명시적 반환 타입
- 서버 컴포넌트 기본, 클라이언트는 `"use client"` 명시
- Tailwind CSS 사용, inline style 금지
- 한국어 UI 텍스트 (영어 금지)
- console.log 금지 (개발 중 임시 제외)

## 금지 사항
- `window`, `document` 직접 접근 금지 (SSR 호환)
- 새 npm 패키지 추가 금지 (논의 후 결정)
- any 타입 사용 금지
- 하드코딩된 API 키/시크릿 금지

## 엔진 구조 규칙
- 각 엔진 폴더: `index.ts` (실행), `types.ts` (타입), `rules.ts` (규칙), `prompts.ts` (AI 프롬프트)
- 엔진 간 의존: 반드시 types.ts의 타입으로만 데이터 전달
- 파이프라인: `src/engine/pipeline.ts`에서 순차 실행

## 검증 명령어
```bash
npx tsc --noEmit          # 타입 체크
npm run build             # 빌드
npm run lint              # 린트
```

## 커밋 규칙
- feat: 새 기능
- fix: 버그 수정
- refactor: 리팩토링
- docs: 문서
- chore: 설정/환경
