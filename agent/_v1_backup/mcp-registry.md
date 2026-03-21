# MCP 서버 레지스트리

## Context7 — 라이브러리 문서 + 패턴

### 용도
외부 라이브러리 공식 문서, 프레임워크 패턴, 코드 예시 조회

### 활성화 조건
- import/require/from 문에서 외부 라이브러리 감지
- 프레임워크 관련 질문 (Next.js, React, Prisma, Tailwind 등)
- `--c7` 또는 `--context7` 플래그

### 워크플로우
```
1. resolve-library-id — 라이브러리 이름으로 ID 검색
2. get-library-docs — 특정 주제의 문서 조회
3. 패턴 추출 → 구현에 적용
```

### 이 프로젝트에서 주로 사용
- Next.js 16 App Router 패턴
- Prisma 7 쿼리/마이그레이션
- Zustand 5 스토어 패턴
- Tailwind CSS v4 유틸리티
- BullMQ 큐 설정
- @anthropic-ai/sdk, @google/genai 사용법

### 에러 복구
- 라이브러리 못 찾음 → WebSearch 대안 → 직접 구현
- 문서 타임아웃 → 캐시된 지식 사용 → 제한 사항 기록
- 버전 불일치 → 호환 버전 탐색 → 업그레이드 경로 제안

---

## Sequential — 복잡한 분석 + 다단계 추론

### 용도
복잡한 디버깅, 시스템 설계, 아키텍처 리뷰, 다단계 문제 해결

### 활성화 조건
- 복잡한 디버깅 (다중 파일 연관 에러)
- 시스템 설계/아키텍처 결정
- `--think` / `--think-hard` / `--ultrathink` 플래그
- `--seq` 또는 `--sequential` 플래그

### 사고 깊이
| 플래그 | 토큰 | 용도 |
|--------|------|------|
| `--think` | ~4K | 모듈 레벨 분석, import 체인 5+ 파일 |
| `--think-hard` | ~10K | 시스템 전체 분석, 크로스 모듈 의존성 |
| `--ultrathink` | ~32K | 크리티컬 재설계, 보안 취약점, 성능 50%+ 저하 |

### 이 프로젝트에서 주로 사용
- 엔진 간 데이터 플로우 분석
- Cross-Engine Bridge 로직 검토
- 품질 게이트 실패 원인 분석
- Learning Loop 진단 알고리즘 설계

### 에러 복구
- 타임아웃 → Claude Code 네이티브 분석 → 제한 사항 기록

---

## Magic — UI 컴포넌트 생성

### 용도
모던 UI 컴포넌트 생성, 디자인 시스템 통합, 반응형 설계

### 활성화 조건
- UI 컴포넌트 생성/수정 요청
- 디자인 시스템 관련 작업
- `--magic` 플래그

### 컴포넌트 카테고리
- Interactive: 버튼, 폼, 모달, 드롭다운
- Layout: 그리드, 카드, 패널, 사이드바
- Display: 타이포그래피, 아이콘, 차트
- Feedback: 알림, 진행률, 로딩
- Input: 텍스트 필드, 셀렉터, 파일 업로드
- Navigation: 메뉴, 탭, 페이지네이션

### 이 프로젝트에서 주로 사용
- 위저드 UI (입력 폼 4단계)
- 에디터 UI (섹션 편집/재배치)
- 대시보드 UI (분석 차트/메트릭)
- 프라이싱 페이지

### 에러 복구
- 생성 실패 → Context7로 프레임워크 패턴 조회 → 직접 구현

---

## Playwright — E2E 테스트 + 브라우저 자동화

### 용도
크로스 브라우저 E2E 테스트, 성능 모니터링, 시각적 검증

### 활성화 조건
- E2E 테스트 생성/실행
- 시각적 검증 필요 (스크린샷)
- 성능 측정 (Core Web Vitals)
- `--play` 또는 `--playwright` 플래그

### 브라우저 지원
Chrome, Firefox, Safari, Edge + 모바일 에뮬레이션

### 이 프로젝트에서 주로 사용
- 위저드 플로우 E2E 테스트
- 생성된 랜딩페이지 시각적 검증
- 랜딩페이지 성능 측정 (LCP, FID, CLS)
- 반응형 레이아웃 검증 (모바일/데스크톱)

### 에러 복구
- 브라우저 연결 실패 → Bash("npm run test:e2e") → 수동 테스트 요청

---

## 조합 패턴

| 조합 | 용도 |
|------|------|
| Sequential + Context7 | 아키텍처 분석 + 공식 패턴 대조 |
| Magic + Context7 | UI 생성 + 프레임워크 규칙 준수 |
| Sequential + Playwright | 성능 분석 + 실측 검증 |
| 전체 (--all-mcp) | 복잡도 >0.8인 종합 분석 |

## 비활성화

| 플래그 | 효과 |
|--------|------|
| `--no-mcp` | 전체 MCP 비활성화 (네이티브만) |
| `--no-magic` | Magic만 비활성화 |
| `--no-seq` | Sequential만 비활성화 |
| `--no-c7` | Context7만 비활성화 |
| `--no-play` | Playwright만 비활성화 |
