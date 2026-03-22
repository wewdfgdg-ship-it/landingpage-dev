렌더러 v2: Template Engine (콘텐츠 주입기) 구현

## 목표
`src/engine/10-code-engine/template-engine.ts`를 생성한다.
템플릿 레지스트리에서 템플릿을 가져와 카피/이미지를 주입하고 최종 HTML을 생성하는 엔진.

## 전제 조건
- Group 1 (세션 11~14): 16개 템플릿 파일 생성 완료
- Group 2 (세션 15): template-registry.ts 완료
- Group 2 (세션 16): 이미지 스펙 시스템 완료

## 작업 내용

### `src/engine/10-code-engine/template-engine.ts`

핵심 함수:

```typescript
import type { CopyBlock, CopyBlocks } from '@/engine/05-psychological-copy/types';
import type { LayoutConfig, SectionLayout } from '@/engine/08-layout-intelligence/types';
import type { StyleConfig, DesignTokens } from '@/engine/09-visual-style/types';
import type { GeneratedPage, RenderedSection } from './types';
import { getTemplate, resolvePatternId, initRegistry } from './template-registry';

/**
 * 섹션 하나를 렌더링
 * 1. patternId → 실제 템플릿 매핑
 * 2. 템플릿 조회
 * 3. render(copy, tokens) 호출
 * 4. scoped wrapper 씌우기
 */
export function renderSection(
  section: SectionLayout,
  copy: CopyBlock,
  tokens: DesignTokens,
  order: number,
): RenderedSection { ... }

/**
 * 전체 페이지 조립
 * 1. 레지스트리 초기화
 * 2. 글로벌 CSS 생성 (리셋 + 폰트 + 공통 스타일)
 * 3. 섹션별 renderSection 호출
 * 4. HTML 문서 조립 (head + body + tracking)
 */
export function buildPage(
  copyBlocks: CopyBlocks,
  layoutConfig: LayoutConfig,
  styleConfig: StyleConfig,
  projectId?: string,
): GeneratedPage { ... }

/**
 * 글로벌 CSS 생성
 * - CSS Reset (minimal)
 * - 폰트 로드 (Google Fonts CDN)
 * - CSS 변수 (design tokens → custom properties)
 * - 반응형 미디어 쿼리
 */
function buildGlobalCss(tokens: DesignTokens): string { ... }

/**
 * HTML 문서 조립
 * - <!DOCTYPE html>
 * - <head> (meta, title, description, og, css)
 * - <body> (sections + sticky CTA + tracking script)
 */
function assembleHtml(
  meta: { title: string; description: string },
  globalCss: string,
  sectionsHtml: string[],
  trackingScript?: string,
): string { ... }
```

### 기존 index.ts와의 관계

- 기존 `index.ts`의 `runCodeEngine` 함수가 `template-engine.ts`의 `buildPage`를 호출하도록 변경
- 기존 `renderers.ts`는 **삭제하지 않음** (fallback용 유지)
- template-engine이 템플릿을 찾지 못하면 기존 renderers.ts의 renderByPatternId로 fallback

### CSS 변수 시스템

DesignTokens를 CSS Custom Properties로 변환:
```css
:root {
  --color-primary: #...;
  --color-bg: #...;
  --font-display: ...;
  --space-sm: 8px;
  --space-md: 16px;
  ...
}
```

템플릿들은 이 CSS 변수를 사용하여 일관된 스타일 유지.

## 검증 명령어
```bash
npx tsc --noEmit
```

## 주의사항
- 기존 index.ts의 assembleHtml, buildGlobalCss 로직을 이 파일로 이동/재구현
- renderers.ts는 삭제하지 않음 — fallback으로 유지
- tracking script는 Engine 12의 generateTrackingScript 사용
- 순환 의존 방지: template-engine → template-registry → templates/ → types만
- GeneratedPage 타입은 기존 types.ts 것 그대로 사용
