렌더러 v2: Feature 섹션 템플릿 4개 생성

## 목표
`src/engine/10-code-engine/templates/` 폴더에 검증된 Feature HTML 템플릿 4개를 생성한다.

## 작업 내용

### 1. `src/engine/10-code-engine/templates/feat-3col-grid.ts`
- 3열 그리드 특징 카드
- 각 카드: 아이콘/이미지 + 제목 + 설명
- bulletPoints 배열을 3개 카드로 분배
- 카드 호버 효과 (그림자 상승)

### 2. `src/engine/10-code-engine/templates/feat-zigzag.ts`
- 교차 배치 (홀수: 텍스트-이미지, 짝수: 이미지-텍스트)
- bulletPoints를 2~3개 블록으로 나누어 지그재그 배치
- 각 블록에 이미지 영역

### 3. `src/engine/10-code-engine/templates/feat-icon-list.ts`
- 수직 아이콘 리스트
- 각 항목: 체크 아이콘 + 텍스트
- bulletPoints를 리스트 아이템으로 변환
- 좌측 아이콘 라인 연결 옵션

### 4. `src/engine/10-code-engine/templates/feat-numbered-steps.ts`
- 번호가 매겨진 단계별 설명
- 1, 2, 3... 숫자 원형 배지 + 각 단계 설명
- 수평 진행 바 또는 수직 타임라인 스타일

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
- scoped CSS (BEM 또는 data-attribute 기반) — 다른 섹션과 클래스 충돌 방지
- 반응형: 768px 브레이크포인트 (3col → 1col 스택)
- DesignTokens의 typography, colors, spacing 활용
- 간격: 8px 그리드 (8, 16, 24, 32, 48, 64, 80px)
- 요소 간 겹침 절대 금지
- bulletPoints가 0~5개일 때 모두 정상 렌더링

## 검증 명령어
```bash
npx tsc --noEmit
```

## 주의사항
- CopyBlock의 bulletPoints 배열 길이에 따른 방어 코드 필수
- `esc()` 함수로 XSS 방지
- imageUrl 없을 때 placeholder 처리
- order 파라미터로 지그재그 방향 결정 (홀수/짝수)
