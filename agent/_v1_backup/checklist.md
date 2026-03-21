# 검증 체크리스트

## 코드 변경 후 (필수)

### 타입 안전
```bash
npx tsc --noEmit
```
- [ ] TypeScript 에러 0개
- [ ] `any` 타입 없음
- [ ] 모든 함수에 명시적 반환 타입

### 린트
```bash
npm run lint
```
- [ ] ESLint 에러 0개
- [ ] warning 5개 이하 (초과 시 수정 권장)

### 빌드
```bash
npm run build
```
- [ ] 빌드 성공
- [ ] 빌드 warning 확인 (새 warning 발생 시 검토)

### 코드 규칙
- [ ] import 절대경로 (`@/`) 사용
- [ ] `console.log` 없음
- [ ] `window`/`document` 직접 접근 없음 (SSR 호환)
- [ ] 한국어 UI 텍스트 (영어 금지)
- [ ] Tailwind CSS 사용 (inline style 금지)
- [ ] 서버 컴포넌트 기본 (`"use client"` 필요 시만)

---

## 엔진 구현 후

### 구조 체크
- [ ] `types.ts` 정의 완료 (입출력 타입)
- [ ] `index.ts`에서 `runXxx` 함수 export
- [ ] 이전 엔진 출력 타입과 입력 타입 호환
- [ ] 엔진 간 데이터 전달은 types.ts 타입으로만

### 파이프라인 연결
- [ ] `src/engine/pipeline.ts`에 import 추가
- [ ] 실행 순서 올바름 (workflow.md DAG 참조)
- [ ] progress 콜백 연결 (`emitProgress`)
- [ ] 비용 추적 (`totalCost += result.cost`)

### AI 엔진 추가 체크 (AI 호출이 있는 경우)
- [ ] `prompts.ts` 시스템/유저 프롬프트 정의
- [ ] JSON prefill 사용 (Claude)
- [ ] 재시도 로직 (max 2)
- [ ] 비용 계산 정확

### 규칙 엔진 추가 체크 (AI 없는 경우)
- [ ] 순수 함수 (부작용 없음)
- [ ] 엣지 케이스 처리 (빈 배열, null, 범위 초과)
- [ ] 계산 결과 범위 검증 (점수 0~100 등)

---

## API 라우트 구현 후

### 인증/권한
- [ ] `auth()` 또는 `getUserId()` 호출
- [ ] 미인증 시 401 반환
- [ ] 리소스 소유권 확인 (다른 사용자 데이터 접근 불가)

### 입력 검증
- [ ] 필수 파라미터 체크
- [ ] 타입 검증
- [ ] 범위/형식 검증

### 에러 처리
- [ ] try-catch 래핑
- [ ] 적절한 HTTP 상태 코드 (400, 401, 403, 404, 500)
- [ ] 에러 메시지에 민감 정보 미포함

### 응답
- [ ] 응답 타입 정의
- [ ] JSON 직렬화 가능 확인
- [ ] 불필요한 데이터 미포함

---

## UI 컴포넌트 구현 후

### 접근성
- [ ] 시맨틱 HTML 사용
- [ ] 키보드 내비게이션 가능
- [ ] aria 속성 적절히 사용

### 반응형
- [ ] 모바일 (< 768px) 대응
- [ ] 태블릿 (768~1024px) 대응
- [ ] 데스크톱 (> 1024px) 대응

### 성능
- [ ] 불필요한 리렌더 없음
- [ ] 이미지 최적화 (next/image)
- [ ] 무거운 연산은 useMemo/useCallback

---

## DB 스키마 변경 후

- [ ] `npx prisma db push` 성공
- [ ] `npx prisma generate` 성공
- [ ] 기존 데이터와 호환 (마이그레이션 필요 시 확인)
- [ ] 인덱스 적절히 추가 (자주 조회하는 필드)

---

## 배포 전 (전체 검증)

- [ ] 전체 빌드 성공 (`npm run build`)
- [ ] E2E 테스트 통과 (`npm run test:e2e`)
- [ ] 환경변수 확인 (`.env.example` 기준)
- [ ] DB 스키마 최신 (`npx prisma db push`)
- [ ] Worker 정상 동작 확인
- [ ] API 엔드포인트 수동 테스트
