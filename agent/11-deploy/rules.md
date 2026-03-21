# 규칙 — Deploy Agent

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

### 배포 사전 검증
- `project.status === 'GENERATED'` 확인 필수 (다른 상태에서 배포 차단)
- `project.generatedHtml` 존재 확인 필수 (HTML 없으면 배포 차단)
- 프로젝트 소유권 검증: `orgId` 기반 `findFirst` 조건

### slug 규칙
- slug 생성은 이 엔진의 책임이 아님 (프로젝트 생성 시 결정)
- `project.slug ?? project.id` fallback 로직만 사용
- slug가 없으면 project.id를 URL에 사용

### URL 형식 규칙
- 상대 경로 형식: `/p/${slug}`
- 내부 호스팅 전략 (`strategy: 'internal'`)
- 향후 R2/커스텀 도메인 전략 추가 시 URL 형식 변경 예정

### deployedAt ISO 형식
- `new Date().toISOString()` 사용
- 타임존: UTC
- 형식: `YYYY-MM-DDTHH:mm:ss.sssZ`

### DB 상태 업데이트 규칙
- 배포: `isDeployed=true, deployedAt=now, status='DEPLOYED'`
- 배포 해제: `isDeployed=false, status='GENERATED'` (undeploy 함수)
- `db.project.update` (배포) / `db.project.updateMany` (배포 해제) 사용
- 소유권 조건 (`orgId`, `deletedAt: null`) 항상 포함

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
| URL 형식 위반 | `/p/${slug}` 패턴으로 자동 수정 |

### 사용자 판단 필요한 위반
| 위반 | 행동 |
|------|------|
| any 타입이 불가피 | 사용자에게 근거 설명 + 승인 요청 |
| 새 패키지 필요 | 대안 탐색 → 불가피 시 사용자 승인 |
| 엔진 구조 변경 | 설계 논의 요청 |
| 배포 전략 변경 (internal→r2) | 사용자 승인 후 변경 |

## 위반 → loop.md 연결

| 위반 유형 | 감지 방법 | loop.md 루프 | 심각도 |
|----------|----------|-------------|--------|
| 사전 검증 누락 | checklist (pre_validation) | DB 조회 실패 루프 | error |
| status 체크 누락 | status !== 'GENERATED' 미검증 | DB 조회 실패 루프 | error |
| generatedHtml 체크 누락 | HTML 존재 미검증 | DB 조회 실패 루프 | error |
| 소유권 검증 누락 | orgId 조건 미포함 | 즉시 수정 | error |
| slug 빈 문자열 | checklist (slug_valid) | DB 조회 실패 루프 | error |
| URL 형식 위반 | checklist (url_valid) | 즉시 수정 | error |
| DB 업데이트 실패 | checklist (db_update_success) | DB 업데이트 실패 루프 | error |
| undeploy 누락 | 배포 해제 기능 미구현 | 즉시 수정 | error |
| tsc 에러 | Bash("npx tsc --noEmit") | 표준 루프 | error |
| lint 에러 | Bash("npm run lint") | 표준 루프 | error |
| build 실패 | Bash("npm run build") | 표준 루프 | error |

> 위반 기록은 checklist.md → [FAIL_TRIGGER] → loop.md 경로로 자동 전달

## 업데이트 규칙

- 새 규칙 추가: 사용자 지시 또는 반복 에러 패턴(3회+) 발생 시
- 규칙 삭제: 사용자 명시적 지시 시만
- 엔진 특화 규칙: 해당 엔진 작업 중 발견된 패턴에서 추가
- 위반→loop.md 연결: 새 위반 유형 발견 시 테이블에 추가
- reviewer.md 피드백: 검수에서 발견된 미체크 위반 추가
