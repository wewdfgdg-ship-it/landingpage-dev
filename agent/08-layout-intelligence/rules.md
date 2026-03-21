# 규칙 — Layout Intelligence Agent

## CLAUDE.md 상속 규칙

### 수정 가능/금지 경로
- 수정 가능: `src/`, `prisma/`, `public/`, `scripts/`, `docs/`, `agent/`
- 수정 금지: `.env`, `next.config.ts`, `package.json`, `tsconfig.json`, `.github/`

### Import 규칙
```
@/*           → src/* (절대경로 필수)
@/engine/XX-name → 엔진 모듈
```

## 에이전트 전용 규칙

### 필수
- 파일 수정 전 반드시 Read tool로 현재 내용 확인
- TypeScript strict mode
- 한국어 UI 텍스트

### 금지
- `any` 타입, `console.log`, 새 npm 패키지, 자동 커밋/push

### 엔진 구조 규칙
```
src/engine/08-layout-intelligence/
├── index.ts    — 실행 (runLayoutIntelligence) + PATTERNS (42개) + ROLE_CATEGORY_MAP + scorePattern + getZoneForOrder
└── types.ts    — 타입 정의 (LayoutCategory, LayoutPattern, SectionLayout, LayoutConfig)
```
- 별도 `rules.ts` 없음 — 패턴 라이브러리와 매핑 규칙이 index.ts에 inline 정의

## 엔진 특화 규칙

### 패턴 ID 유효성 규칙
- 모든 `selectedPattern`은 index.ts 내 PATTERNS[] 배열에 정의된 42개 패턴 중 하나
- 미존재 패턴 ID 사용 금지 (FAIL 판정)
- 새 패턴 추가 시 PATTERNS[] 배열에 추가

### 패턴 다양성 규칙 (diversity)
- usedPatterns Set으로 이미 사용된 패턴 ID + 카테고리 추적
- 중복 ID 사용 시 scorePattern에서 다양성 점수 0점 (hard reject 아닌 scoring 감점)
- diversityScore = `Math.round((uniquePatterns.size / sections.length) × 100)` (연속 감점 없음)

### mobileReadyScore 규칙
- 전체 섹션 패턴의 mobileScore 평균
- mobileReadyScore ≥ 70 목표

### Zone 결정 규칙
- `getZoneForOrder(order, totalSections)`: 섹션 순서/전체 비율로 Zone 자동 결정
- order === 1 → first_view, ≤40% → interest, ≤75% → desire, 나머지 → action
- 참고: attentionConfig 파라미터는 현재 미사용 (`_attention`)

### 비용 규칙
- 이 엔진은 규칙 엔진이므로 AI 비용 0

## 위반 대응 프로토콜

```
규칙 위반 감지 (lint/tsc/review/checklist)
    │
    ├── 자동 수정 가능 → 즉시 수정 + memory.md에 기록
    ├── 판단 필요 → 사용자에게 에스컬레이션
    └── 모든 위반 기록
        → memory.md 실수 섹션에 누적
        → checklist.md 검수 결과 반영
```

### 위반→loop.md 연결 테이블

| 위반 항목 | 감지 소스 | loop.md 루프 | 자동/수동 |
|----------|----------|-------------|----------|
| patternId 미존재 | checklist.md | patternId 미존재 루프 | 자동 |
| diversityScore < 40 | checklist.md | diversityScore 미달 루프 | 자동 |
| mobileReadyScore < 50 | checklist.md | mobileReadyScore 개선 루프 | 자동 |
| SectionLayout 필드 누락 | checklist.md | 출력 구조 수정 루프 | 자동 |
| 결정론성 위반 | reviewer.md | 표준 루프 (부수효과 제거) | 자동 |
| tsc 에러 | checklist.md | 표준 루프 (타입 수정) | 자동 |
| lint 에러 | checklist.md | 표준 루프 (린트 수정) | 자동 |
| build 실패 | checklist.md | 표준 루프 (빌드 수정) | 자동 |

## 업데이트 규칙

- 새 규칙 추가: 사용자 지시 또는 반복 에러 패턴(3회+)
- 규칙 삭제: 사용자 명시적 지시 시만
- 엔진 특화 규칙: 해당 엔진 작업 중 발견된 패턴에서 추가
