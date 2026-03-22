렌더러 v2: CTA + FAQ + Misc 섹션 템플릿 4개 생성

## 목표
`src/engine/10-code-engine/templates/` 폴더에 CTA 2개 + FAQ 1개 + Misc 1개 HTML 템플릿을 생성한다.

## 작업 내용

### 1. `src/engine/10-code-engine/templates/cta-center.ts`
- 중앙 정렬 CTA 블록
- 큰 헤드라인 + 서브카피 + CTA 버튼 + 마이크로카피
- 배경: primary 또는 accent 색상 (대비 높은)
- 버튼: 흰색 또는 반전 색상

### 2. `src/engine/10-code-engine/templates/cta-full-banner.ts`
- 풀 너비 배너 CTA
- 배경 그라디언트 또는 이미지
- 좌측 텍스트 + 우측 CTA 버튼
- 긴급성 요소 (카운트다운, 한정 수량 텍스트)

### 3. `src/engine/10-code-engine/templates/faq-accordion.ts`
- 아코디언 FAQ
- bulletPoints를 Q&A 쌍으로 변환 (홀수: 질문, 짝수: 답변)
- CSS-only 아코디언 (details/summary 태그)
- 열림/닫힘 화살표 아이콘

### 4. `src/engine/10-code-engine/templates/misc-before-after.ts`
- 전/후 비교 레이아웃
- 좌측 "Before" + 우측 "After"
- bulletPoints 전반부: Before 항목, 후반부: After 항목
- 중앙 화살표 구분선

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
- scoped CSS — [data-tpl="cta-center"] 등 고유 셀렉터
- 반응형: 768px
- CTA 버튼: 최소 48px 높이, 호버 효과
- FAQ: details/summary 기반 (JS 없음)
- Before/After: 모바일에서 세로 스택
- DesignTokens 색상, 타이포그래피 활용

## 검증 명령어
```bash
npx tsc --noEmit
```

## 주의사항
- FAQ의 bulletPoints → Q&A 파싱: 항목 수가 홀수일 때 마지막은 답변 없이 표시
- CTA 배경색: primary vs accent 중 대비 높은 것 선택
- `esc()` 함수로 XSS 방지
- Before/After는 bulletPoints를 절반으로 나누어 배분
