# 규칙 — Visual Style Agent

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
src/engine/09-visual-style/
├── index.ts    — 실행 (runVisualStyle) + MOOD_DEFS(10종) + INDUSTRY_MOOD_MAP + adjustByPositioning + buildTypography + buildRadius
└── types.ts    — 타입 정의 (MoodPreset, ColorPalette, TypographyScale, FontFamily, SpacingScale, RadiusScale, ShadowLevel, DesignTokens, StyleConfig)
```
- 별도 `rules.ts`, `mood-presets.ts` 없음 — 무드 정의와 매핑 규칙이 index.ts에 inline 정의

## 엔진 특화 규칙

### DesignTokens 완전성 규칙
- `colors` ColorPalette 12색 전부 정의 필수 (primary, primaryLight, primaryDark, secondary, accent, background, surface, textPrimary, textSecondary, textMuted, border, error)
- `typography` TypographyScale 9레벨 전부 정의 필수 (display, h1~h4, body, small, caption, button — lineHeight는 string 타입)
- `spacing` SpacingScale 6단계 전부 정의 필수 (xs, sm, md, lg, xl, 2xl — number 타입)
- `radius` RadiusScale 6단계 전부 정의 필수 (none, sm, md, lg, xl, full — number 타입)
- `defaultShadow` ShadowLevel 유효값 (none, sm, md, lg, xl, inner)
- `sectionPadding` string (예: '80px 0')

### 무드 유효값 규칙 (MoodPreset)
- 10종만 유효: luxury, clean, tech, natural, fun_pop, professional, startup, premium, bold, minimal
- 매칭 안 되는 업종은 기본 무드 (clean) 사용 — INDUSTRY_MOOD_MAP의 'other' 키 참조

### fontFamily 규칙 (FontFamily)
- 3종만 유효: sans, serif, mono
- 무드별 매핑 (MOOD_DEFS에 정의):
  - luxury, premium → serif
  - tech → mono
  - 나머지 8종 → sans

### 색상 유효성 규칙
- 모든 색상은 유효한 hex 형식 (#RRGGBB)
- 배경색과 텍스트색의 대비율 WCAG AA 이상 권장

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
| mood 10종에 없음 | checklist.md | 무드 미유효 루프 | 자동 |
| colors 12색 누락 | checklist.md | 색상 누락 루프 | 자동 |
| typography 레벨 누락 | checklist.md | typography 누락 루프 | 자동 |
| spacing 단계 누락 | checklist.md | spacing 누락 루프 | 자동 |
| fontFamily 3종에 없음 | checklist.md | fontFamily 미유효 루프 | 자동 |
| hex 색상 무효 | checklist.md | 색상 누락 루프 | 자동 |
| 결정론성 위반 | reviewer.md | 표준 루프 (부수효과 제거) | 자동 |
| tsc 에러 | checklist.md | 표준 루프 (타입 수정) | 자동 |
| lint 에러 | checklist.md | 표준 루프 (린트 수정) | 자동 |
| build 실패 | checklist.md | 표준 루프 (빌드 수정) | 자동 |

## 업데이트 규칙

- 새 규칙 추가: 사용자 지시 또는 반복 에러 패턴(3회+)
- 규칙 삭제: 사용자 명시적 지시 시만
- 무드 프리셋 추가/수정: index.ts MOOD_DEFS + engine-spec.md 동시 갱신 (별도 mood-presets.ts/rules.ts 없음)
- 엔진 특화 규칙: 해당 엔진 작업 중 발견된 패턴에서 추가
