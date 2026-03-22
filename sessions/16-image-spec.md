렌더러 v2: 이미지 스펙 시스템 + 크로마키 처리

## 목표
템플릿별 이미지 규격 시스템과 그린스크린 크로마키 처리를 구현한다.

## 작업 내용

### 1. `src/engine/image-generation/types.ts` 확장

기존 타입에 이미지 스펙 인터페이스 추가:

```typescript
export interface ImageSpec {
  required: boolean;
  aspectRatio: '4:3' | '16:9' | '1:1' | '3:4';
  cutout: boolean;        // 투명 배경 필요 → 그린스크린 생성
  maxWidth: number;       // px
  style: 'product' | 'lifestyle' | 'abstract' | 'icon';
}
```

### 2. `src/engine/image-generation/prompts.ts` 수정

그린스크린 프롬프트 추가:
- cutout=true인 경우: "배경을 순수한 초록색(#00FF00) 단색으로 설정. 제품/인물만 선명하게, 배경에 그림자나 다른 요소 없이."
- cutout=false인 경우: 기존 방식 유지

### 3. `src/engine/image-generation/index.ts` 수정

크로마키 처리 파이프라인:
```
생성(Gemini) → 크로마키(sharp) → 업로드(R2) → CDN URL
```

- sharp의 `removeAlpha`, `flatten`, `composite` 대신 직접 픽셀 처리
- #00FF00 ±허용 범위(threshold) 내 픽셀 → 투명(alpha=0)으로 변환
- sharp가 이미 설치되어 있는지 확인 (없으면 package.json 수정 불가이므로 대안 사용)

### 4. 크로마키 처리 함수

```typescript
async function chromaKeyRemoval(imageBuffer: Buffer, threshold: number = 80): Promise<Buffer> {
  // sharp로 raw 픽셀 데이터 추출
  // G값이 높고 R,B값이 낮은 픽셀 → alpha=0
  // 엣지 안티앨리어싱 처리
  // PNG 포맷으로 반환 (투명 배경)
}
```

### 5. sharp 사용 가능 여부 확인

```bash
# package.json에 sharp가 있는지 확인
# 있으면 import 사용, 없으면 Canvas API 또는 다른 방법
```

만약 sharp가 없고 새 패키지 추가가 금지라면:
- 대안: Gemini에 "투명 배경" 직접 요청 (PNG 형식)
- 또는: CSS background-blend-mode로 클라이언트 사이드 처리

## 검증 명령어
```bash
npx tsc --noEmit
```

## 주의사항
- `package.json` 수정 금지 — 새 패키지 추가 불가
- sharp가 이미 있으면 사용, 없으면 Gemini 프롬프트로 투명 배경 직접 요청
- 이미지 생성 비용: Gemini API 호출이므로 기존 구조 유지
- R2 업로드 시 Content-Type: image/png (투명 배경)
- 기존 image-generation 코드 구조 유지하며 확장
