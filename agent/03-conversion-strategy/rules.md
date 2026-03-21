# 규칙 — Conversion Strategy Agent

## CLAUDE.md 상속 규칙

### 수정 가능 경로
- `src/` — 모든 소스코드
- `prisma/` — DB 스키마
- `public/` — 정적 파일
- `scripts/` — Worker 스크립트
- `docs/` — 개발 문서
- `agent/` — 에이전트 문서

### 수정 금지 경로
- `.env`, `.env.local` — 환경변수
- `next.config.ts` — 논의 후 수정
- `package.json` — 논의 후 수정
- `tsconfig.json` — 논의 후 수정
- `.github/` — CI/CD

### Import 규칙
```
@/*           → src/* (절대경로 필수)
@/lib/db      → Prisma client
@/lib/auth    → NextAuth
@/lib/redis   → Upstash Redis
@/lib/ai/claude → Claude AI
@/lib/ai/gemini → Gemini AI
@/lib/utils   → 유틸리티
@/engine/XX-name → 엔진 모듈
```

## 에이전트 전용 규칙

### 필수
- 파일 수정 전 반드시 Read tool로 현재 내용 확인
- TypeScript strict mode — 모든 함수에 명시적 반환 타입
- 서버 컴포넌트 기본, 클라이언트는 `"use client"` 명시
- Tailwind CSS 사용, inline style 금지
- 한국어 UI 텍스트 (영어 금지)

### 금지
- `any` 타입 사용 금지
- `console.log` 금지 (개발 중 임시 제외)
- `window`, `document` 직접 접근 금지 (SSR 호환)
- 새 npm 패키지 추가 금지 (사용자 논의 후 결정)
- 하드코딩된 API 키/시크릿 금지
- 자동 커밋/push 금지 (사용자 승인 필수)

### 엔진 구조 규칙
```
src/engine/XX-name/
├── index.ts    — 실행 (runXxx 함수 export)
├── types.ts    — 타입 정의
├── rules.ts    — 규칙 (선택)
└── prompts.ts  — AI 프롬프트 (선택, AI 엔진만)
```
- 엔진 간 데이터 전달: types.ts의 타입으로만
- 파이프라인 연결: `src/engine/pipeline.ts`에서 순차 실행

### 안전 규칙
- 되돌릴 수 없는 작업 전 사용자 확인:
  - git reset --hard, git push --force
  - 파일/브랜치 삭제
  - DB 마이그레이션 (prisma db push)
  - 배포 (vercel deploy)
- 대규모 변경(10+ 파일) 시 단계별 실행, 중간 검증

### 비용 규칙
- AI 호출 시 예상 비용 기록 (₩ 단위)
- 불필요한 AI 호출 최소화
- Claude: JSON prefill, 캐싱 활용

## 엔진 특화 규칙

### prompts.ts 규칙
- 시스템 프롬프트는 반드시 **한국어**로 작성
- Claude 호출 시 **JSON prefill 필수** (assistant 메시지에 `{` 포함하여 JSON 응답 유도)
- 전략 유형 5가지를 프롬프트에 명확히 정의하여 AI가 유효한 값만 생성하도록 유도
- structure 배열의 JSON 스키마를 프롬프트에 포함 (필수 필드 명시)

### 입출력 규칙
- `strategyType`은 반드시 5가지 유효값 중 하나: `'direct_sale' | 'lead_generation' | 'free_trial' | 'content_hook' | 'event_registration'`
- `totalSections`는 5~16 범위 (범위 초과 시 클램핑)
- `structure[].order`는 1부터 시작하는 연속 번호 보장
- `structure[]` 배열 순서 = order 순서 (정렬 보장)
- `ctaPositions`의 모든 값은 0 ~ totalSections-1 범위
- `estimatedScrollDepth`는 non-empty string (예: "5400px")
- `targetReadTime`은 non-empty string (예: "5분")
- SectionRole은 7가지 유효값: `'HOOK' | 'PAIN' | 'SOLUTION' | 'PROOF' | 'OBJECTION' | 'URGENCY' | 'CTA'`

### 전략 유형 결정 규칙 (index.ts selectStrategy)
- pageGoal 기반 매핑: purchase→direct_sale, signup→free_trial, inquiry→lead_generation, download/newsletter→content_hook, registration→event_registration
- SaaS + (signup|purchase) → `'free_trial'` 우선
- B2B → `'lead_generation'` 우선
- 매핑 실패 시 기본값: `'direct_sale'`

### 비용 추적 규칙
- AI 호출의 입력/출력 토큰 수 기록
- 호출당 예상 비용 계산: (입력 토큰 × 단가) + (출력 토큰 × 단가)
- 비용이 ₩500 초과 예상 시 사용자 승인 요청

## 위반 대응 프로토콜

```
규칙 위반 감지 (lint/tsc/review)
    │
    ├── 자동 수정 가능 (import 경로, 타입 누락, 린트 에러)
    │   → 즉시 수정 + memory.md에 기록
    │
    ├── 판단 필요 (설계 변경, 구조 변경)
    │   → 사용자에게 에스컬레이션
    │
    └── 모든 위반 기록
        → memory.md 실수 섹션에 누적
        → 같은 위반 3회+ → rules.md에 명시적 규칙 추가 검토
        → checklist.md에 관련 체크 항목 추가 검토
```

### 위반 → loop.md 연결

| 위반 유형 | 감지 시점 | loop.md 연결 |
|----------|----------|-------------|
| strategyType 유효하지 않음 | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md 엔진 특화 루프 |
| structure[].order 불연속 | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md structure order 루프 |
| AI JSON 파싱 실패 | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md JSON 파싱 루프 |
| 필수 role 누락 (hook/action) | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md 누락 섹션 루프 |
| 비용 ₩500 초과 | checklist.md 비용 추적 | WARN → 사용자 승인 요청 |
| tsc/lint/build 에러 | checklist.md 필수 체크 | [FAIL_TRIGGER] → loop.md 표준 루프 |

### 자동 수정 가능한 위반
| 위반 | 자동 수정 |
|------|----------|
| import 상대경로 | `@/` 절대경로로 변환 |
| 반환 타입 누락 | 타입 추론 후 명시 |
| console.log 남김 | 삭제 |
| lint 에러 (formatting) | 자동 수정 |
| structure order 불연속 | 재정렬 |

### 사용자 판단 필요한 위반
| 위반 | 행동 |
|------|------|
| any 타입이 불가피 | 사용자에게 근거 설명 + 승인 요청 |
| 새 패키지 필요 | 대안 탐색 → 불가피 시 사용자 승인 |
| 엔진 구조 변경 | 설계 논의 요청 |
| 새 strategyType 추가 필요 | 사용자 승인 후 타입 확장 |

## 업데이트 규칙

- 새 규칙 추가: 사용자 지시 또는 반복 에러 패턴(3회+) 발생 시
- 규칙 삭제: 사용자 명시적 지시 시만
- 엔진 특화 규칙: 해당 엔진 작업 중 발견된 패턴에서 추가
