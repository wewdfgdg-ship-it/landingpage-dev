# 규칙 — Product Intelligence Agent

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
- Gemini 이미지: 768px 리사이즈, JPEG, File API 활용
- Claude: JSON prefill, 캐싱 활용

## 엔진 특화 규칙

### prompts.ts 규칙
- 시스템 프롬프트는 반드시 **한국어**로 작성
- Claude 호출 시 **JSON prefill 필수** (assistant 메시지에 `{` 포함하여 JSON 응답 유도)
- 3개 AI 호출 (`extractProductDNA`, `analyzeCustomer`, `buildResistanceMap`)의 비용을 개별 추적하고 합산하여 `totalCost`에 반영

### 입출력 규칙
- `confidenceScore`는 항상 0~100 범위 (범위 초과 시 클램핑)
- `resistanceMap`의 모든 키에 `level` 필드가 존재해야 하며, 값은 1~5 범위
- `productDNA`의 모든 필수 필드가 non-null/non-undefined여야 함
- AI 응답이 JSON 파싱 실패 시 → 재시도 (max 2) → 실패 시 에스컬레이션

### 비용 추적 규칙
- 각 AI 호출의 입력/출력 토큰 수 기록
- 호출당 예상 비용 계산: (입력 토큰 × 단가) + (출력 토큰 × 단가)
- 3회 호출 합산이 ₩500 초과 예상 시 사용자 승인 요청

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
```

### 자동 수정 가능한 위반
| 위반 | 자동 수정 |
|------|----------|
| import 상대경로 | `@/` 절대경로로 변환 |
| 반환 타입 누락 | 타입 추론 후 명시 |
| console.log 남김 | 삭제 |
| lint 에러 (formatting) | 자동 수정 |

### 사용자 판단 필요한 위반
| 위반 | 행동 |
|------|------|
| any 타입이 불가피 | 사용자에게 근거 설명 + 승인 요청 |
| 새 패키지 필요 | 대안 탐색 → 불가피 시 사용자 승인 |
| 엔진 구조 변경 | 설계 논의 요청 |

## 체크리스트 연동 앵커

> 이 파일의 규칙은 checklist.md의 검증 항목으로 자동 반영된다.

| 이 파일 규칙 | checklist.md 항목 | 자동 검증 |
|-------------|-------------------|----------|
| 한국어 시스템 프롬프트 | AI 엔진 추가 체크 | prompts.ts 내용 확인 |
| JSON prefill 필수 | AI 엔진 추가 체크 | assistant 메시지 `{` 시작 확인 |
| 비용 개별 추적 + 합산 | 비용 추적 검증 | totalCost 존재 확인 |
| confidenceScore 클램핑 | confidenceScore 검증 | Math.min/max 로직 존재 |
| resistanceMap level 클램핑 | resistanceMap 검증 | 클램핑 로직 존재 |
| Import 절대경로 (@/) | 코드 규칙 | Grep 검증 |
| console.log 없음 | 코드 규칙 | Grep 검증 |
| any 타입 없음 | 타입 안전 | tsc --noEmit |

> 이 파일에 새 규칙 추가 시 checklist.md에도 검증 항목 추가 여부를 검토한다.

## 위반 → loop.md 연결

> 위반이 자동 수정 불가능하고 반복되면 loop.md의 에러 패턴 DB에 등록된다.
> 위반 기록은 memory.md의 MISTAKES 섹션에도 동기화된다.

## 업데이트 규칙

- 새 규칙 추가: 사용자 지시 또는 반복 에러 패턴(3회+) 발생 시 + **checklist.md 동기화 검토**
- 규칙 삭제: 사용자 명시적 지시 시만
- 엔진 특화 규칙: 해당 엔진 작업 중 발견된 패턴에서 추가
