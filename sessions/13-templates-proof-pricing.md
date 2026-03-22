렌더러 v2: Proof + Pricing 섹션 템플릿 4개 생성

## 목표
`src/engine/10-code-engine/templates/` 폴더에 Social Proof 2개 + Pricing 2개 HTML 템플릿을 생성한다.

## 작업 내용

### 1. `src/engine/10-code-engine/templates/proof-testimonial-card.ts`
- 고객 후기 카드 그리드 (2~3열)
- 각 카드: 별점(★) + 후기 텍스트 + 고객명
- bulletPoints를 각 후기로 변환
- 카드 그림자 + 따옴표 아이콘

### 2. `src/engine/10-code-engine/templates/proof-number-counter.ts`
- 숫자 카운터 (누적 고객수, 만족도 등)
- 3~4개 큰 숫자 + 라벨
- bulletPoints에서 "10,000+명 이용" 형태 파싱
- 배경: surface 색상 대비

### 3. `src/engine/10-code-engine/templates/price-3col-compare.ts`
- 3열 가격 비교 카드
- 가운데 카드 강조 (추천 배지 + 크기 확대)
- 각 카드: 플랜명 + 가격 + 기능 리스트 + CTA
- bulletPoints를 기능 리스트로 변환

### 4. `src/engine/10-code-engine/templates/price-single-card.ts`
- 단일 가격 카드 (중앙 배치)
- 가격 + 기능 리스트 + CTA
- 할인 전/후 가격 표시 옵션
- 심플하고 직관적

## 각 템플릿 파일 구조

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

export const config: TemplateConfig = { ... };

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  // 검증된 HTML/CSS 반환
}
```

## 디자인 품질 기준
- scoped CSS — 섹션별 고유 접두사 (예: [data-tpl="proof-testimonial"])
- 반응형: 768px (3col → 1col)
- DesignTokens 활용 (colors, typography, spacing)
- 간격: 8px 그리드
- 가격 카드: primary 색상 강조, surface 배경 대비
- 후기 카드: 인용부호(") 장식 요소
- 별점: ★ 문자로 렌더링 (SVG 아님)

## 검증 명령어
```bash
npx tsc --noEmit
```

## 주의사항
- CopyBlock에 가격 전용 필드가 없으므로 body, bulletPoints로 가격 정보 표현
- 후기도 bulletPoints 기반 — 3~5개 항목 방어 코드
- `esc()` 함수로 XSS 방지
- 가격 카드의 "추천" 배지는 하드코딩 (두 번째 카드)
