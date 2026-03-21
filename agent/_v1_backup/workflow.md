# 워크플로우

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
    │       └──▶ ⑧ Layout Intelligence ──규칙──→ LayoutConfig
    │
    ▼
⑤ Psychological Copy ──AI×1(+retry)──→ CopyBlocks
    │                                    (품질 게이트: ≥80점, max 2 retry)
    │
    ├──▶ ⑥ Trust Architecture ──규칙──→ TrustConfig
    │
    ▼
Cross-Engine Bridge ──규칙──→ enrichedCopy + enrichedLayout + zoneAnnotations
    │  ├── Objection → Copy 주입
    │  ├── Trust → Layout 반영
    │  └── Attention → Zone 어노테이션
    │
    ▼
⑨ Visual Style ──규칙──→ StyleConfig (DesignTokens)
    │
    ▼
Image Generation ──Gemini×N(병렬3)──→ ImageGenerationOutput
    │                                  (이미지 URL → CopyBlocks에 주입)
    │
    ▼
⑩ Code Engine ──규칙──→ GeneratedPage (fullHtml)
    │                     (Zone 어노테이션 HTML 주입)
    │
    ▼
⑪ Deploy ──규칙──→ DeployResult (slug, url)
    │
    ▼
⑫ Learning Loop ──AI×1──→ Diagnosis + Prescription + A/B
    │                       (매일 06:00 cron)
    └──→ ①로 피드백 (WinningPattern)
```

## 4 Phase 타이밍

| Phase | 엔진 | 시간 | AI 호출 |
|-------|------|------|---------|
| 1. 분석 | ①→②→③→④ | 15-30초 | Claude ×4 |
| 2. 생성 | ⑤→⑥→⑦→⑧→⑨ + Bridge | 30-60초 | Claude ×1 (+retry) |
| 3. 이미지 | Image Gen | 30-90초 | Gemini ×N (병렬 3) |
| 4. 빌드 | ⑩→⑪→(⑫) | 5-10초 | 규칙만 |
| **총** | | **80-190초** | **5-6회** |

## 엔진별 AI/규칙 구분

| 엔진 | AI | 규칙 | 모델 | 비용/회 |
|------|-----|------|------|---------|
| ① Product Intelligence | ✅ ×3 | - | Claude Sonnet | ~$0.05 |
| ② Why Now | - | ✅ | - | $0 |
| ③ Conversion Strategy | ✅ ×1 | ✅ | Claude Sonnet | ~$0.03 |
| ④ Objection Killer | - | ✅ | - | $0 |
| ⑤ Psychological Copy | ✅ ×1(+retry) | ✅ | Claude Sonnet | ~$0.05 |
| ⑥ Trust Architecture | - | ✅ | - | $0 |
| ⑦ Attention Architecture | - | ✅ | - | $0 |
| ⑧ Layout Intelligence | - | ✅ | - | $0 |
| ⑨ Visual Style | - | ✅ | - | $0 |
| Image Generation | ✅ ×N | - | Gemini Flash | ~$0.08/장 |
| ⑩ Code Engine | - | ✅ | - | $0 |
| ⑪ Deploy | - | ✅ | - | $0 |
| ⑫ Learning Loop | ✅ ×1 | ✅ | Claude Sonnet | ~$0.03 |

## 에러 처리 전략

```
에러 발생
    │
    ├── AI 호출 실패 → 재시도 (max 2, 지수 백오프)
    │                   └── 2회 실패 → 사용자에게 에스컬레이션
    │
    ├── 품질 게이트 실패 → 재생성 (max 2, 피드백 프롬프트)
    │                      └── 2회 실패 → 현재 결과로 진행 + 경고
    │
    ├── 이미지 생성 실패 → 해당 섹션 스킵 (placeholder)
    │                      └── failedSections 배열에 기록
    │
    └── DB/인프라 오류 → 즉시 중단 + 에러 보고
```

## 개발 Phase 로드맵

### Phase 0 (1주) — 기반
- 프로젝트 셋업, DB 스키마, 인증, 기본 UI
- ✅ 완료됨

### Phase 1 (3주) — MVP 엔진
- 입력 위저드
- ①②③⑤ 엔진
- BullMQ + SSE
- 기본 미리보기

### Phase 2 (2주) — 디자인 레이어
- ⑧⑨⑩ 엔진 (20패턴, 5무드)
- 이미지 파이프라인
- HTML 내보내기

### Phase 3 (2주) — 에디터 + 나머지 엔진
- 에디터 UI
- ④⑥⑦ 엔진
- 섹션 재생성
- ⑪ 자체 호스팅

### Phase 4 (2주) — 분석 + 학습
- 트래킹, 대시보드
- ⑫ 자동 진단 + A/B
- WinningPattern

### Phase 5 (1주) — 비즈니스
- 결제, 사용량, 플랜

## 품질 게이트 위치

### ⑤ 카피 품질 게이트 (자동)
- **위치**: Psychological Copy 엔진 내부
- **기준**: frame 점수(60%) + tone 점수(40%) = combined ≥ 80
- **실패 시**: 실패 섹션만 재생성 (max 2회, buildRetryPrompt → mergeCopy)
- **파일**: `src/engine/05-psychological-copy/quality-gate.ts`

### 코드 검증 게이트 (수동)
- **위치**: 모든 코드 변경 후
- **기준**: checklist.md 항목 전체 통과
- **실패 시**: loop.md 발동
