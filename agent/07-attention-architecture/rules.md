# 규칙 — Attention Architecture Agent

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
@/engine/XX-name → 엔진 모듈
```

## 에이전트 전용 규칙

### 필수
- 파일 수정 전 반드시 Read tool로 현재 내용 확인
- TypeScript strict mode — 모든 함수에 명시적 반환 타입
- 한국어 UI 텍스트 (영어 금지)

### 금지
- `any` 타입 사용 금지
- `console.log` 금지
- 새 npm 패키지 추가 금지 (사용자 논의 후 결정)
- 하드코딩된 API 키/시크릿 금지
- 자동 커밋/push 금지

### 엔진 구조 규칙
```
src/engine/07-attention-architecture/
├── index.ts    — 실행 (runAttentionArchitecture 함수 export) + selectHookType + GAZE_MAP + buildZones
└── types.ts    — 타입 정의 (ZoneType, HookType, GazePattern, ZoneConfig, AttentionConfig)
```
- 별도 `rules.ts` 없음 — Hook/Gaze/Zone 규칙이 index.ts에 inline 정의
- AI 호출 없음 — prompts.ts 불필요

## 엔진 특화 규칙

### 4 Zone 필수 규칙
- 반드시 4개 Zone 생성: first_view, interest, desire, action (순서 고정)
- Zone 누락 금지, Zone 추가 금지 (정확히 4개)

### pixelRange 규칙
- 픽셀 기반 경계: totalHeight = totalSections × 600 (평균 섹션 높이)
- zone[0].pixelRange.start === 0
- zone[i].pixelRange.end === zone[i+1].pixelRange.start
- 겹침/간격 금지
- Zone 경계: 첫 섹션(600px) / 40% / 75% / 100%

### 콘텐츠 비율 규칙
- 각 Zone에 `visualRatio`, `textRatio`, `dataRatio`, `ctaRatio` 지정
- 페이지 비율(ratio 합 1.0) 아님 — Zone 내 콘텐츠 유형 비율

### hookType 결정 규칙
- decisionType만으로 결정 (switch 문)
- 유효값: visual_hook, question_hook, result_hook, social_hook
- 매칭 안 되면 기본값: visual_hook

### gazePattern 결정 규칙
- industry로 결정 (GAZE_MAP Record)
- 유효값: f_pattern, z_pattern, center_focus
- 매칭 안 되면 기본값: z_pattern

### stickyCtaEnabled / exitIntentEnabled 규칙
- stickyCtaEnabled: `resistanceMap.urgency.level >= 4` OR `totalSections >= 10`
- exitIntentEnabled: `resistanceMap.price.level >= 4`

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
| zones 4개 미만 | checklist.md | Zone 누락 루프 | 자동 |
| pixelRange 겹침/간격 | checklist.md | pixelRange 겹침 루프 | 자동 |
| hookType 무효값 | checklist.md | 표준 루프 (hookType 매핑 수정) | 자동 |
| gazePattern 무효값 | checklist.md | 표준 루프 (GAZE_MAP 수정) | 자동 |
| Zone 이름 순서 오류 | reviewer.md | 표준 루프 (이름 매핑 수정) | 자동 |
| 결정론성 위반 | reviewer.md | 표준 루프 (부수효과 제거) | 자동 |
| tsc 에러 | checklist.md | 표준 루프 (타입 수정) | 자동 |
| lint 에러 | checklist.md | 표준 루프 (린트 수정) | 자동 |
| build 실패 | checklist.md | 표준 루프 (빌드 수정) | 자동 |

## 업데이트 규칙

- 새 규칙 추가: 사용자 지시 또는 반복 에러 패턴(3회+) 발생 시
- 규칙 삭제: 사용자 명시적 지시 시만
- 엔진 특화 규칙: 해당 엔진 작업 중 발견된 패턴에서 추가
