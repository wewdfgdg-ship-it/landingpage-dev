# 워크플로우 — Code Engine Agent

## 12엔진 파이프라인 DAG

```
사용자 입력 (위저드 3단계)
    │
    ▼
① Product Intelligence ──AI×3──→ ProductBrief
    │
    ├──▶ ② Why Now ──────규칙────→ UrgencyBrief
    │       │
    │       ▼
    ├──▶ ③ Conversion Strategy ──AI×1──→ StrategyBlueprint
    │       │
    │       ├──▶ ④ Objection Killer ──규칙──→ ObjectionMap
    │       ├──▶ ⑦ Attention Architecture ──규칙──→ AttentionConfig
    │       │       │
    │       │       ▼
    │       ├──▶ ⑧ Layout Intelligence ──규칙──→ LayoutConfig
    │       └──▶ ⑨ Visual Style (strategyType → 무드 보정)
    │
    ▼
⑤ Psychological Copy ──AI×1(+retry)──→ CopyBlocks
    │                                    (품질 게이트: ≥80점, max 2 retry)
    │                                    (★ 2회 실패 시 최소 카피 모드)
    │
    ├──▶ ⑥ Trust Architecture ──규칙──→ TrustConfig
    │
    ▼
Cross-Engine Bridge ──규칙──→ enrichedCopy + enrichedLayout + zoneAnnotations
    │
    ▼
⑨ Visual Style ──규칙──→ StyleConfig  (①+③ → 무드+토큰)
    │
    ▼
Image Generation ──Gemini×N(병렬3)──→ ImageGenerationOutput
    │
    ▼
⑩ Code Engine ──규칙──→ GeneratedPage (fullHtml)
    │
    ▼
⑪ Deploy ──규칙──→ DeployResult
    │
    ▼
⑫ Learning Loop ──AI×1──→ Diagnosis + Prescription + A/B
```

## 이 에이전트의 위치

```
★ Phase 4 빌드 — HTML 코드 생성 (규칙 엔진)

⑤(CopyBlocks) + ⑧(LayoutConfig) + ⑨(StyleConfig) + Bridge + Image Gen
    │
    ▼
[★ ⑩ Code Engine ──규칙──→ GeneratedPage (fullHtml)]
    │
    └──▶ ⑪ Deploy (GeneratedPage)
```

### 의존 엔진 (입력 제공)

| 엔진 | 출력 | 이 에이전트가 사용하는 필드 |
|------|------|---------------------------|
| ⑤ Psychological Copy | CopyBlocks | sections[].sectionOrder, sections[].copy (headline, subheadline, body, bulletPoints, ctaText, microCopy, imageDirection) |
| ⑧ Layout Intelligence | LayoutConfig | sections[].order, sections[].role, sections[].sectionType, sections[].selectedPattern |
| ⑨ Visual Style | StyleConfig | tokens (DesignTokens — 색상, 폰트, 인라인 스타일로 적용) |
| ⑫ Learning Loop | generateTrackingScript | projectId 있으면 트래킹 스크립트 HTML 삽입 |
| 위저드 | productName | 제품명 (meta.title에 사용) |

### 후속 엔진 (출력 수신)

| 엔진 | 필요한 필드 | 용도 |
|------|-----------|------|
| ⑪ Deploy | GeneratedPage 전체 (fullHtml, meta, sections) | R2 업로드 + 배포 |

### 실행 조건

- **필수 입력**: CopyBlocks, LayoutConfig, StyleConfig가 non-null이어야 함
- **필수 필드**: layoutConfig.sections[].selectedPattern이 모두 유효한 렌더러에 매핑
- **선택 입력**: stickyCtaEnabled (기본 false), projectId (없으면 트래킹 스크립트 미삽입)
- **카피 매칭**: sectionCopy.sectionOrder === sectionLayout.order 로 매칭

### 실패 시 영향 범위

- **영향**: ⑪ Deploy **블록** — HTML이 없으면 배포 불가
- **페이지 미생성**: 사용자에게 직접 영향 (결과물 없음)
- **복구 방안**: 렌더러 에러 → 해당 섹션 fallback HTML → 부분 결과라도 GeneratedPage 반환 → ⑪에 전달

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |

**이 에이전트의 Phase**: Phase 4 (빌드) — 규칙 엔진, 1-3초 내 완료 목표

## 에러 처리 전략

```
에러 발생
    │
    ├── 렌더러 매핑 실패 (patternId 없음) → fallback 렌더러 사용 (기본 섹션 HTML)
    │
    ├── esc() 누락 감지 → 즉시 수정 + 경고
    │
    ├── HTML 태그 닫힘 오류 → 자동 수정 시도 (DOMParser 등)
    │
    ├── 인라인 스타일 매핑 실패 → 기본값 적용 + 경고
    │
    └── 전체 빌드 실패 → 즉시 중단 + 에러 보고
```

## 개발 Phase 로드맵

| Phase | 기간 | 포함 엔진 |
|-------|------|----------|
| 0. 기반 | 1주 ✅ | 셋업, DB, 인증, 기본 UI |
| 1. MVP | 3주 | ①②③⑤ + BullMQ + SSE |
| 2. 디자인 | 2주 | ⑧⑨⑩ + 이미지 + HTML 내보내기 |
| 3. 에디터 | 2주 | ④⑥⑦⑪ + 에디터 UI + 섹션 재생성 |
| 4. 분석 | 2주 | ⑫ + 트래킹 + A/B |
| 5. 비즈니스 | 1주 | 결제, 사용량, 플랜 |

**이 에이전트의 개발 Phase**: Phase 2 (디자인) — ⑩은 HTML 코드 생성 엔진

## 실행 맵 (Execution Map)

```
Stage 1: 타입/구조 확인
   Read(types.ts) → 입출력 타입 구조 확인 (GeneratedPage, CopyBlocks 등)

Stage 2: 렌더러 확인/구현
   Read(renderers.ts) → 14개 렌더러 함수 + 42 patternId 매핑 확인
   Grep("renderByPatternId") → 패턴 매핑 완전성 확인
   Write/Edit(renderers.ts) → 렌더러 추가/수정 + esc() 적용

Stage 3: 핵심 함수 구현
   Write/Edit(index.ts) → runCodeEngine 구현/수정
   → globalCss 생성 (tokens → 인라인 CSS, 폰트 패밀리, 반응형)
   → 섹션 순회 → sectionOrder 매칭 → renderByPatternId 호출 → fullHtml 조립

Stage 4: 파이프라인 연결
   Edit(src/engine/pipeline.ts) → import + 실행 순서 + emitProgress

Stage 5: 보안 검증
   Grep("esc(") → XSS 이스케이프 전수 검증
   Grep("innerHTML") → innerHTML 직접 사용 감지
   Grep("@media") → 반응형 미디어 쿼리 존재 확인
   Grep("data-section-id") → 섹션 래퍼 속성 확인

Stage 6: 검증 + 검수
   Bash("npx tsc --noEmit") → 타입 체크
   Bash("npm run lint") → 린트
   Bash("npm run build") → 빌드
   → checklist.md 실행 → [HANDOFF_TO_REVIEWER] 생성
   → reviewer.md 검수 → [REVIEW_RESULT] 생성
   → FAIL 시 loop.md 발동
```

### MCP 활성화 기준

| Stage | MCP | 조건 |
|-------|-----|------|
| 1~2 | --magic (선택) | UI 패턴 참조 필요 시 |
| 3 | --c7 (선택) | CSS/반응형 패턴 참조 시 |
| 4 | - | 내부 코드만 |
| 5 | - | Grep/Read만 |
| 6 | --seq (FAIL 시만) | 복잡한 에러 분석 필요 시 |

## 현재 실행 상태 (자동 갱신)

- 마지막 실행: -
- 평균 실행 시간: -
- 성공률: -
- 자주 발생하는 에러: → memory.md 참조

## 업데이트 규칙

- 매 실행 후: "현재 실행 상태" 섹션 갱신
- memory.md에도 동기화
- DAG 변경 시 (pipeline.ts 수정): 즉시 반영
- 실행 맵 변경 시: Stage/MCP 테이블 업데이트
