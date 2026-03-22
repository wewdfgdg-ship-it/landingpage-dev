렌더러 v2: Code Engine 통합 + 빌드 검증

## 목표
`src/engine/10-code-engine/index.ts`를 수정하여 v2 템플릿 시스템을 사용하도록 통합한다.
전체 빌드(tsc + build + lint) 통과를 확인한다.

## 전제 조건
- Group 1 (세션 11~14): 16개 템플릿 파일 완료
- Group 2 (세션 15~16): registry + 이미지 스펙 완료
- Group 3 (세션 17): template-engine 완료

## 작업 내용

### 1. `src/engine/10-code-engine/index.ts` 수정

기존 `runCodeEngine` 함수에서:
- ~~직접 renderers.ts의 renderByPatternId 호출~~
- → template-engine.ts의 `buildPage` 호출로 교체

```typescript
import { buildPage } from './template-engine';

export async function runCodeEngine(
  copyBlocks: CopyBlocks,
  layoutConfig: LayoutConfig,
  styleConfig: StyleConfig,
  projectId?: string,
): Promise<GeneratedPage> {
  return buildPage(copyBlocks, layoutConfig, styleConfig, projectId);
}
```

### 2. Fallback 메커니즘 확인

- template-engine이 특정 패턴을 렌더링할 수 없으면 → 기존 renderers.ts의 renderByPatternId 사용
- 이 fallback 로직이 template-engine.ts에 이미 구현되어 있어야 함

### 3. 빌드 검증 (3단계)

```bash
# 1. 타입 체크
npx tsc --noEmit

# 2. 빌드
npm run build

# 3. 린트
npm run lint
```

3단계 모두 통과해야 완료.

### 4. 사이드이펙트 점검

변경 영향을 받는 파일 확인:
- `src/engine/pipeline.ts` — runCodeEngine 호출부 (시그니처 변경 없으면 OK)
- `src/app/api/projects/[id]/generate/route.ts` — 파이프라인 호출
- `src/app/api/projects/[id]/generate-stream/route.ts` — 스트리밍 파이프라인
- `src/stores/editor-store.ts` — 에디터에서 HTML 사용

### 5. 기존 코드 정리

- `renderers.ts` — 삭제하지 않음 (fallback용 유지, deprecated 주석 추가)
- `index.ts` — import 정리, 미사용 코드 제거

## 검증 명령어
```bash
npx tsc --noEmit && npm run build && npm run lint
```

## 완료 기준
- [ ] tsc --noEmit: 0 errors
- [ ] npm run build: 성공
- [ ] npm run lint: 0 errors
- [ ] 기존 API 시그니처 변경 없음
- [ ] fallback 동작 확인
- [ ] pipeline.ts 호출부 정상

## 주의사항
- runCodeEngine의 시그니처(입출력 타입)는 변경하지 않음 — 하위 호환성 유지
- pipeline.ts, API 라우트 등 호출부는 수정 불필요해야 함
- 빌드 실패 시 에러 원인 분석 → 수정 후 재빌드
- lint 경고도 가능하면 제거
