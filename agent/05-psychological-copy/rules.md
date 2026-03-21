# 규칙 — Psychological Copy Agent

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
src/engine/05-psychological-copy/
├── index.ts    — 실행 (runPsychologicalCopy 함수 export)
├── types.ts    — 타입 정의
├── frames.ts   — 7가지 설득 프레임
├── tone-matrix.ts — 9개 업종별 톤
├── quality-gate.ts — 품질 게이트 (THRESHOLD=80)
└── prompts.ts  — AI 프롬프트 (generateCopy, buildRetryPrompt)
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
- 재시도 비용도 합산하여 추적

## 엔진 특화 규칙

### 품질 게이트 규칙
- qualityScore 80점 미달 시 **무조건 재시도** (수동 개입 없이)
- 재시도 시 실패 섹션만 재생성 (성공 섹션은 유지)
- MAX_RETRIES(2) 초과 후에는 현재 결과 반환 + 경고
- qualityScore = avgFrameScore × 0.6 + avgToneScore × 0.4

### headline 규칙
- 모든 섹션의 headline ≤ 15자 (초과 시 FAIL)
- headline은 비어있을 수 없음

### 섹션 완전성 규칙
- strategyBlueprint.structure[]에 명시된 모든 role에 대해 카피 생성 필수
- 누락 섹션은 FAIL 판정
- 각 섹션의 CopyBlock 필드 전부 존재: headline, subheadline, body, bulletPoints, ctaText, microCopy, imageDirection
- frames.ts가 role 기반으로 매핑 (HOOK/PAIN/SOLUTION/PROOF/OBJECTION/URGENCY/CTA + DEFAULT)

### 톤 규칙
- industry → tone-matrix.ts 매핑이 없는 업종은 기본 프로필(DEFAULT_PROFILE, industry='other') 사용
- 전체 톤 일관성 유지 (개별 섹션 toneScore 최소 50)

### prompts.ts 규칙
- 시스템 프롬프트는 반드시 **한국어**로 작성
- Claude 호출 시 **JSON prefill 필수** (assistant 메시지에 `{` 포함)
- buildRetryPrompt는 실패 섹션 목록 + 실패 사유를 명확히 전달

### 비용 추적 규칙
- 1차 호출 + 재시도 호출 모두 개별 비용 추적
- 총 비용 = 모든 호출의 (입력 토큰 × 단가) + (출력 토큰 × 단가) 합산
- ₩500 초과 예상 시 사용자 승인 요청

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
        → checklist.md 체크 항목 추가 검토
```

### 위반 → loop.md 연결

| 위반 유형 | 감지 시점 | loop.md 연결 |
|----------|----------|-------------|
| overallScore < 80 (섹션별 combinedScore 미달) | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md 품질 게이트 실패 루프 |
| headline > 15자 | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md headline 초과 루프 |
| 섹션 누락 (role 미존재) | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md 섹션 누락 루프 |
| CopyBlock 필수 필드 누락 | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md 표준 루프 |
| tone(industry) 미매핑 | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md 표준 루프 |
| JSON 파싱 실패 | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md JSON 파싱 실패 루프 |
| 재시도 로직 오류 | checklist.md 엔진 특화 체크 | [FAIL_TRIGGER] → loop.md 표준 루프 |
| 프롬프트 인젝션 취약점 | reviewer.md 보안 관점 | [FAIL_TRIGGER] → loop.md 표준 루프 |
| tsc/lint/build 에러 | checklist.md 필수 체크 | [FAIL_TRIGGER] → loop.md 표준 루프 |

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

## 업데이트 규칙

- 새 규칙 추가: 사용자 지시 또는 반복 에러 패턴(3회+) 발생 시
- 규칙 삭제: 사용자 명시적 지시 시만
- 엔진 특화 규칙: 해당 엔진 작업 중 발견된 패턴에서 추가
