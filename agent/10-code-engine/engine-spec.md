# 엔진 스펙 — Code Engine Agent

## 담당 엔진

- **번호**: ⑩
- **이름**: Code Engine
- **경로**: `src/engine/10-code-engine/`
- **AI/규칙**: 규칙 엔진 (AI 없음)
- **핵심 함수**: `runCodeEngine(productName: string, copyBlocks: CopyBlocks, layoutConfig: LayoutConfig, styleConfig: StyleConfig, stickyCtaEnabled: boolean, projectId?: string): GeneratedPage`

## 입력 타입

```typescript
// CopyBlocks — ⑤ Psychological Copy 출력
interface CopyBlocks {
  sections: {
    sectionOrder: number;
    copy: {
      headline: string;
      subheadline: string;
      body: string;
      bulletPoints: string[];
      ctaText: string;
      microCopy: string;
      imageDirection: string;
      imageUrl?: string;
    };
  }[];
  qualityScore: number;
}

// LayoutConfig — ⑧ Layout Intelligence 출력
interface LayoutConfig {
  sections: SectionLayout[];  // order, role, sectionType, selectedPattern, patternName, score, reasoning
}

// StyleConfig — ⑨ Visual Style 출력
interface StyleConfig {
  mood: MoodPreset;
  moodName: string;
  moodDescription: string;
  tokens: DesignTokens;  // 색상, 타이포, 간격 (인라인 스타일로 적용)
  reasoning: string;
}

// 추가 입력
// productName: string — 제품명
// stickyCtaEnabled: boolean — 하단 고정 CTA 사용 여부
// projectId?: string — 프로젝트 ID (선택, 있으면 ⑫ 트래킹 스크립트 삽입)
```

**입력 제공 엔진**: ⑤ Psychological Copy (CopyBlocks), ⑧ Layout Intelligence (LayoutConfig), ⑨ Visual Style (StyleConfig), ⑫ Learning Loop (generateTrackingScript)

## 출력 타입

```typescript
interface RenderedSection {
  order: number;
  role: string;
  sectionType: string;
  patternId: string;
  html: string;
  css: string;                 // 인라인 스타일 사용으로 항상 빈 문자열
}

interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
}

interface GeneratedPage {
  meta: PageMeta;
  globalCss: string;           // 글로벌 리셋 + 반응형 CSS (인라인 스타일, CSS 변수 미사용)
  sections: RenderedSection[];
  fullHtml: string;            // 전체 페이지 HTML (meta + globalCss + sections 조합)
  totalSections: number;
  generatedAt: string;         // ISO8601 타임스탬프
}
```

**출력 수신 엔진**: ⑪ Deploy

## 특수 컴포넌트

### renderers.ts — 14개 렌더러 함수 (42 patternId 매핑)

| 함수 | 입력 | 설명 |
|------|------|------|
| `renderByPatternId` | patternId, copy(CopyBlock), tokens(DesignTokens), order | 42개 patternId → 14개 렌더러 매핑 + fallback |
| `renderHeroFullscreenCenter` | copy, tokens | 히어로 풀스크린 중앙 |
| `renderHeroLeftRight` | copy, tokens | 히어로 좌우 분할 |
| `renderFeat3ColGrid` | copy, tokens | 3열 그리드 특징 |
| `renderFeatZigzag` | copy, tokens, order | 지그재그 (order 홀짝 방향) |
| `renderFeatIconList` | copy, tokens | 아이콘 리스트 |
| `renderFeatNumberedSteps` | copy, tokens | 번호 단계 |
| `renderProofTestimonialCard` | copy, tokens | 후기 카드 |
| `renderProofNumberCounter` | copy, tokens | 숫자 카운터 |
| `renderCtaCenter` | copy, tokens | CTA 중앙 |
| `renderCtaFullBanner` | copy, tokens | CTA 풀배너 |
| `renderFaqAccordion` | copy, tokens | FAQ 아코디언 |
| `renderMiscBeforeAfter` | copy, tokens | Before/After |
| `renderMiscProcessFlow` | copy, tokens | 프로세스 플로우 (→ renderFeatNumberedSteps 위임) |
| `renderGenericSection` | copy, tokens | 범용 폴백 렌더러 |

### Degraded Copy 처리

> ⑤ Psychological Copy가 `isDegraded: true`로 반환한 경우의 처리 규칙.

```
CopyBlocks 수신
    │
    ├── isDegraded === false (정상) → 일반 렌더링
    │
    └── isDegraded === true → Degraded 모드
        │
        ├── degradedSections에 포함된 role
        │   └── renderGenericSection (심플 렌더러) 강제 사용
        │       ├── headline + bulletPoints만 렌더링
        │       ├── body 빈 경우 → 본문 영역 생략
        │       └── imageDirection → placeholder 이미지
        │
        └── degradedSections에 미포함 role
            └── 일반 렌더링 (patternId 기반)
```

**Degraded 모드 출력 특징**:
- `GeneratedPage.meta.description`에 "(일부 섹션 품질 제한)" 접미사 추가
- 각 degraded 섹션 HTML에 `data-degraded="true"` 속성 추가
- ENGINE_WARNING 전파: 에디터 UI에서 "카피 품질 개선 필요" 안내 표시용

### 유틸 함수

| 함수 | 시그니처 | 용도 |
|------|----------|------|
| `esc(s)` | `(s: string) → string` | XSS 방지 HTML 이스케이프 (&, <, >, ") |
| `bullets(items)` | `(items: string[]) → string` | ✓ 불릿 리스트 HTML 생성 |
| `ctaButton(text, colors, micro?)` | `(text: string, colors: ColorPalette, micro?: string) → string` | CTA 버튼 + microCopy HTML |
| `imageBlock(copy, c, maxWidth?)` | `(copy: CopyBlock, c: ColorPalette, maxWidth?: string) → string` | CDN URL 있으면 img, 없으면 placeholder |

## 인접 엔진 타입 호환

### 이전 엔진 출력 → 내 입력 매핑

| 소스 | 소스 필드 | 내 입력 필드 | 변환 |
|------|----------|-------------|------|
| ⑤ Psychological Copy | CopyBlocks | copyBlocks | 직접 매핑 (sectionOrder로 매칭) |
| ⑧ Layout Intelligence | LayoutConfig | layoutConfig | 직접 매핑 (sections[].selectedPattern 사용) |
| ⑨ Visual Style | StyleConfig | styleConfig | tokens → 인라인 스타일로 적용 |
| ⑫ Learning Loop | generateTrackingScript | trackingHtml | projectId 있으면 트래킹 스크립트 삽입 |
| 위저드 | productName | productName | meta.title + 기본 카피에 사용 |
| 사용자 설정 | stickyCtaEnabled | stickyCtaEnabled | boolean (하단 고정 CTA 바) |

### 내 출력 → 다음 엔진 입력 매핑

| 대상 엔진 | 내 출력 필드 | 대상 입력 필드 | 변환 |
|----------|-------------|---------------|------|
| ⑪ Deploy | GeneratedPage 전체 | DeployInput.generatedPage | 직접 매핑 |

## 출력 품질 기준

### 합격 기준
- `fullHtml` 비어있지 않음 (길이 > 0)
- 모든 HTML 태그 닫힘 (열린 태그 == 닫힌 태그)
- 모든 사용자 데이터에 `esc()` 적용 (XSS 방지)
- 반응형 CSS 포함 (미디어 쿼리 존재)
- `totalSections` == `sections[].length`
- 모든 `sections[].html` 비어있지 않음
- 모든 `sections[].patternId`에 대응하는 렌더러 존재

### 경고 기준
- 특정 섹션의 HTML 크기가 비정상적으로 큼 (>50KB)
- 이미지 URL이 없는 섹션 (placeholder 사용)
- CSS 변수 매핑 누락 (스타일 토큰 미적용)

### 불합격 기준
- `fullHtml` 빈 문자열
- 닫히지 않은 HTML 태그 존재
- `esc()` 미적용 사용자 데이터 존재 (XSS 취약점)
- `sections[]` 빈 배열
- patternId에 대응하는 렌더러 없음 (렌더링 불가)

## 전체 파이프라인 타입 요약

| 엔진 | 출력 타입 | 핵심 필드 |
|------|----------|----------|
| ① Product Intelligence | ProductBrief | productDNA, customerDesire, resistanceMap |
| ② Why Now | UrgencyBrief | primaryType, urgencyElements |
| ③ Conversion Strategy | StrategyBlueprint | strategyType, structure[], ctaPositions |
| ④ Objection Killer | ObjectionMap | activeObjections[] |
| ⑤ Psychological Copy | CopyBlocks | sections[].copy, qualityScore |
| ⑥ Trust Architecture | TrustConfig | trustElements[], trustScore |
| ⑦ Attention Architecture | AttentionConfig | zones[], hookType, gazePattern |
| ⑧ Layout Intelligence | LayoutConfig | sections[].selectedPattern |
| ⑨ Visual Style | StyleConfig | mood, tokens (DesignTokens) |
| Image Gen | ImageGenerationOutput | images[].cdnUrl |
| ⑩ Code Engine | GeneratedPage | fullHtml, sections[].html |
| ⑪ Deploy | DeployResult | slug, url |
| ⑫ Learning Loop | LearningLoopOutput | diagnoses[], prescriptions[] |
| Bridge | CrossEngineBridgeResult | enrichedCopy, enrichedLayout |

## 체크리스트 앵커 (checklist.md 연동)

| # | 항목 | 검증 방법 | 실패 시 |
|---|------|----------|---------|
| 1 | fullHtml 비어있지 않음 | `fullHtml.length > 0` | loop.md 즉시 발동 |
| 2 | HTML 태그 정상 닫힘 | 열린 태그 == 닫힌 태그 | loop.md (HTML 유효성 루프) |
| 3 | XSS esc() 전수 적용 | Grep("esc(") + 사용자 데이터 교차 검증 | loop.md (XSS 취약점 루프) |
| 4 | 인라인 스타일 정확 | tokens.colors/fontFamily가 globalCss와 렌더러에 반영 | loop.md (스타일 매핑 루프) |
| 5 | 반응형 미디어 쿼리 포함 | Grep("@media") | loop.md (반응형 디자인 루프) |
| 6 | 섹션 래퍼 속성 존재 | data-section-id, data-section-order | loop.md (래퍼 속성 루프) |
| 7 | patternId → 렌더러 매핑 완전 | renderByPatternId 매핑 누락 없음 | loop.md (렌더러 매핑 루프) |
| 8 | 결정론성 검증 | 같은 입력 → 같은 fullHtml | loop.md (부수효과 제거 루프) |
| 9 | AI 호출 없음 | 순수 규칙 기반, 비동기 불필요 | 즉시 수정 |
| 10 | tsc/lint/build 통과 | npx tsc --noEmit, npm run lint, npm run build | 즉시 수정 후 재검증 |

## 업데이트 규칙

- types.ts 변경 시: 즉시 이 파일 반영
- 품질 기준 변경 시: memory.md의 패턴에 따라 조정
- 인접 엔진 타입 변경 시: 호환 매핑 재확인
- 체크리스트 앵커 변경 시: checklist.md와 동기화
