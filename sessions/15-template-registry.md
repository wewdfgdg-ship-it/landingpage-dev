렌더러 v2: Template Registry 시스템 구현

## 목표
`src/engine/10-code-engine/template-registry.ts`를 생성한다.
모든 템플릿을 등록하고, patternId로 조회하는 중앙 레지스트리.

## 전제 조건
- Group 1 (세션 11~14)에서 생성한 16개 템플릿 파일이 `templates/` 폴더에 존재
- 각 템플릿은 `config: TemplateConfig`와 `render()` 함수를 export

## 작업 내용

### `src/engine/10-code-engine/template-registry.ts`

```typescript
import type { CopyBlock } from '@/engine/05-psychological-copy/types';
import type { DesignTokens } from '@/engine/09-visual-style/types';

export interface TemplateConfig {
  patternId: string;
  name: string;
  category: 'hero' | 'feature' | 'proof' | 'pricing' | 'cta' | 'faq' | 'misc';
  description: string;
  imageSpec: {
    required: boolean;
    aspectRatio: string;
    cutout: boolean;
    maxWidth: number;
  };
}

export interface Template {
  config: TemplateConfig;
  render: (copy: CopyBlock, tokens: DesignTokens) => string;
}

// 레지스트리 맵
const registry = new Map<string, Template>();

// 등록 함수
export function registerTemplate(template: Template): void { ... }

// 조회 함수
export function getTemplate(patternId: string): Template | undefined { ... }

// 모든 템플릿 목록
export function listTemplates(): TemplateConfig[] { ... }

// 카테고리별 조회
export function getTemplatesByCategory(category: string): Template[] { ... }

// patternId → 실제 템플릿 매핑 (여러 patternId가 하나의 템플릿으로 매핑될 수 있음)
// 예: hero_gradient, hero_minimal_typo → hero-fullscreen-center 템플릿
export function resolvePatternId(patternId: string): string { ... }

// 초기화 — 모든 템플릿 import + 등록
export function initRegistry(): void { ... }
```

### patternId 매핑 테이블

기존 `renderByPatternId`의 switch 문을 매핑 테이블로 변환:

```
hero_fullscreen_center, hero_gradient, hero_minimal_typo → hero-fullscreen-center
hero_left_right, hero_split, hero_card → hero-left-right
hero_product_center, hero_video_bg → hero-product-center
feat_3col_grid, feat_card_grid, feat_comparison → feat-3col-grid
feat_zigzag, feat_large_img_bullets → feat-zigzag
feat_icon_list, feat_accordion, feat_tab → feat-icon-list
feat_numbered_steps, feat_infographic → feat-numbered-steps
proof_testimonial_card, proof_review_carousel, proof_rating_text, proof_sns_grid → proof-testimonial-card
proof_logo_bar, proof_number_counter → proof-number-counter
price_3col_compare, price_toggle, price_feature_matrix → price-3col-compare
price_single_card → price-single-card
cta_center, cta_left_right, cta_sticky_bar, cta_popup → cta-center
cta_full_banner → cta-full-banner
faq_accordion, faq_2col, faq_search → faq-accordion
misc_before_after → misc-before-after
misc_timeline, misc_process_flow, misc_team, misc_newsletter, misc_footer → generic (fallback)
```

## 검증 명령어
```bash
npx tsc --noEmit
```

## 주의사항
- TemplateConfig 인터페이스를 이 파일에서 export하고 템플릿 파일들이 import
- 기존 renderers.ts의 renderByPatternId switch 문과 동일한 매핑 유지
- fallback: 매핑에 없는 patternId → generic 템플릿 사용
- 순환 의존 방지: templates/ → types만 import, registry → templates/ import
