렌더러 v2: Hero 섹션 템플릿 4개 생성

## 목표
`src/engine/10-code-engine/templates/` 폴더에 검증된 Hero HTML 템플릿 4개를 생성한다.
기존 `renderers.ts`의 인라인 CSS 방식 대신, 디자인이 보장된 고품질 HTML/CSS 템플릿을 만든다.

## 작업 내용

### 1. `src/engine/10-code-engine/templates/hero-fullscreen-center.ts`
- 전체 화면 중앙 정렬 히어로
- 100vh, 대형 타이포그래피, 그라디언트 오버레이 옵션
- CTA 버튼 + 마이크로카피

### 2. `src/engine/10-code-engine/templates/hero-left-right.ts`
- 좌측 텍스트 + 우측 이미지 (또는 반대)
- 이미지 영역: 커터아웃(투명 배경) 또는 풀 이미지 지원
- 반응형: 모바일에서 스택

### 3. `src/engine/10-code-engine/templates/hero-product-center.ts`
- 제품 이미지 중앙 배치
- 상단 헤드라인 + 하단 CTA
- 제품 이미지 그림자/플로팅 효과

### 4. `src/engine/10-code-engine/templates/hero-split.ts`
- 50:50 분할 레이아웃
- 좌측 풀컬러 배경 + 우측 이미지
- 대각선 또는 곡선 분할 옵션

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
    aspectRatio: string;  // "4:3", "16:9", "1:1"
    cutout: boolean;      // 투명 배경 필요 여부
    maxWidth: number;     // px
  };
}

export const config: TemplateConfig = { ... };

export function render(copy: CopyBlock, tokens: DesignTokens): string {
  // 검증된 HTML/CSS 반환
}
```

## 디자인 품질 기준
- Tailwind-like 유틸리티 대신 의미 있는 CSS 클래스명 사용
- 각 템플릿에 scoped CSS (BEM 또는 data-attribute 기반)
- 반응형: 768px 브레이크포인트
- 폰트 크기: rem 단위, DesignTokens의 typography 활용
- 색상: DesignTokens의 ColorPalette 활용
- 간격: 8px 그리드 시스템 (8, 16, 24, 32, 48, 64, 80px)
- 요소 간 겹침 절대 금지
- 최소 터치 타겟: 48px

## 검증 명령어
```bash
npx tsc --noEmit
```

## 주의사항
- `templates/` 폴더가 없으면 생성
- CopyBlock 타입의 모든 필드 활용 (headline, subheadline, body, bulletPoints, ctaText, microCopy, imageUrl)
- `esc()` 함수로 XSS 방지 (기존 renderers.ts 참고)
- imageUrl이 없을 때 placeholder 처리 필수
