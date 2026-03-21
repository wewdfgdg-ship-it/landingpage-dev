# 규칙 — Trust Architecture Agent

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
src/engine/06-trust-architecture/
├── index.ts    — 실행 (runTrustArchitecture 함수 export) + TRUST_TEMPLATES + 규칙 로직
└── types.ts    — 타입 정의 (TrustLevel, TrustElement, TrustConfig)
```
- 별도 `rules.ts` 없음 — 6레벨 신뢰 템플릿이 index.ts에 inline 정의
- 엔진 간 데이터 전달: types.ts의 타입으로만
- 파이프라인 연결: `src/engine/pipeline.ts`에서 순차 실행
- AI 호출 없음 — prompts.ts 불필요

### 안전 규칙
- 되돌릴 수 없는 작업 전 사용자 확인
- 대규모 변경(10+ 파일) 시 단계별 실행, 중간 검증

### 비용 규칙
- 이 엔진은 규칙 엔진이므로 AI 비용 0
- 비용 반환 시 항상 0 반환

## 엔진 특화 규칙

### level 범위 규칙
- 모든 trustElement의 `level`은 1~6 범위
- 범위 초과 시 클램핑: `Math.min(6, Math.max(1, level))`

### sectionOrder 범위 규칙
- `sectionOrder`는 strategyBlueprint.structure[] 인덱스 범위 내
- 범위 초과 시 클램핑: `Math.min(structure.length - 1, Math.max(0, sectionOrder))`

### trustElements 규칙
- 6레벨 TRUST_TEMPLATES 순차 생성 (건너뛰기 금지)
- 레벨6(동료 압력)은 선택적: `decisionType === 'follower'` OR `resistanceMap.trust.level >= 4`
- `selectRelevantElements`: trust 저항 level ≥ 4이면 전체 요소, 아니면 최대 2개

### 배치 매칭 규칙
- 각 레벨의 `targetRoles`로 blueprint.structure[] 매칭
- `findSectionOrder()`: 중복 배치 방지 (usedOrders Set)
- 못 찾으면 `blueprint.totalSections` (마지막 위치) 반환

## 위반 대응 프로토콜

```
규칙 위반 감지 (lint/tsc/review/checklist)
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
        → checklist.md 검수 결과 반영
```

### 위반→loop.md 연결 테이블

| 위반 항목 | 감지 소스 | loop.md 루프 | 자동/수동 |
|----------|----------|-------------|----------|
| trustElements 빈 배열 | checklist.md | trustElements 빈 배열 루프 | 자동 |
| level 범위 초과 (1~6) | checklist.md | level 범위 초과 루프 | 자동 |
| sectionOrder 범위 초과 | checklist.md | sectionOrder 범위 초과 루프 | 자동 |
| 템플릿 매칭 오류 | reviewer.md | 표준 루프 (템플릿 로직 수정) | 자동 |
| 결정론성 위반 | reviewer.md | 표준 루프 (부수효과 제거) | 자동 |
| tsc 에러 | checklist.md | 표준 루프 (타입 수정) | 자동 |
| lint 에러 | checklist.md | 표준 루프 (린트 수정) | 자동 |
| build 실패 | checklist.md | 표준 루프 (빌드 수정) | 자동 |

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
