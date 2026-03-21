# 스킬 레지스트리

## 내장 스킬 매핑

### /build — 프로젝트 빌드
- **자동 호출 조건**: 코드 변경 완료 후 검증 단계
- **동작**: 프레임워크 감지 → 빌드 실행 → 에러 처리
- **이 프로젝트**: `npm run build` (Next.js 16)

### /implement — 기능 구현
- **자동 호출 조건**: 새 엔진/API/컴포넌트 구현 요청
- **동작**: 페르소나 자동 활성화 → MCP 선택 → 구현 → 검증
- **이 프로젝트**: 엔진 index.ts, API route.ts, 컴포넌트 작성
- **MCP 연동**: Magic (UI), Context7 (패턴), Sequential (복잡 로직)

### /analyze — 코드 분석
- **자동 호출 조건**: 코드 품질/보안/성능 점검 요청
- **동작**: 다차원 분석 (품질, 보안, 성능, 아키텍처)
- **이 프로젝트**: 엔진 코드 리뷰, 파이프라인 성능 분석
- **MCP 연동**: Sequential (분석), Context7 (패턴 대조)

### /improve — 코드 개선
- **자동 호출 조건**: 리팩토링, 최적화, 품질 개선 요청
- **동작**: 증거 기반 코드 개선
- **이 프로젝트**: 엔진 로직 최적화, 렌더러 개선
- **MCP 연동**: Sequential (로직), Context7 (패턴)

### /test — 테스트
- **자동 호출 조건**: 테스트 생성/실행 요청
- **동작**: 테스트 전략 수립 → 생성 → 실행 → 리포트
- **이 프로젝트**: E2E (위저드, 에디터), 엔진 유닛 테스트
- **MCP 연동**: Playwright (E2E), Sequential (전략)

### /cleanup — 정리
- **자동 호출 조건**: 데드코드 정리, 기술부채 감소 요청
- **동작**: 사용되지 않는 코드 탐지 → 제거 → 검증
- **이 프로젝트**: 레거시 코드, 미사용 import, 중복 타입 정리

### /design — 설계
- **자동 호출 조건**: 시스템/API/컴포넌트 설계 요청
- **동작**: 아키텍처 설계 → 인터페이스 정의 → 문서화
- **이 프로젝트**: 새 엔진 설계, API 엔드포인트 설계
- **MCP 연동**: Magic (UI), Sequential (아키텍처), Context7 (패턴)

### /troubleshoot — 문제 진단
- **자동 호출 조건**: 버그, 에러, 성능 이슈 발생
- **동작**: 증상 수집 → 원인 분석 → 해결책 제시
- **이 프로젝트**: 파이프라인 에러, AI 호출 실패, 빌드 에러
- **MCP 연동**: Sequential (분석), Playwright (재현)

### /explain — 설명
- **자동 호출 조건**: 코드/개념 설명 요청
- **동작**: 교육적 설명 제공
- **이 프로젝트**: 엔진 로직 설명, 파이프라인 플로우 설명

### /git — Git 워크플로우
- **자동 호출 조건**: 커밋, PR, 브랜치 관련 요청
- **동작**: 지능형 커밋 메시지, 브랜치 관리
- **이 프로젝트**: feat/fix/refactor 커밋, PR 생성

### /document — 문서 생성
- **자동 호출 조건**: 문서 작성 요청
- **동작**: 대상 분석 → 문서 생성
- **이 프로젝트**: 엔진 문서, API 문서, 설계 문서

## 스킬 조합 패턴

### 새 기능 구현 사이클
```
/design → /implement → /test → /build
```

### 코드 품질 개선 사이클
```
/analyze → /improve → /test → /build
```

### 버그 수정 사이클
```
/troubleshoot → /implement → /test → /build
```

### 정리 사이클
```
/analyze → /cleanup → /build
```

## 외부 스킬 검색

prompts.chat에서 필요 시 외부 스킬 탐색:

```
search_skills("Next.js API route")    → Next.js 관련 스킬
search_skills("Prisma migration")     → DB 관련 스킬
search_skills("React component")      → 컴포넌트 스킬
search_skills("E2E test playwright")  → 테스트 스킬
```

### 스킬 설치 절차
1. `search_skills(query)` — 검색
2. `get_skill(id)` — 상세 확인
3. 파일을 `.claude/skills/{slug}/` 에 저장
4. SKILL.md 내용을 에이전트 컨텍스트에 반영

## 자동 호출 판단 로직

```
사용자 요청 분석
    │
    ├── "구현/만들어/추가" → /implement
    ├── "분석/점검/리뷰" → /analyze
    ├── "개선/최적화/리팩토링" → /improve
    ├── "테스트/검증" → /test
    ├── "정리/삭제/제거" → /cleanup
    ├── "설계/설계해/구조" → /design
    ├── "에러/버그/안됨" → /troubleshoot
    ├── "설명/어떻게/왜" → /explain
    ├── "커밋/푸시/PR" → /git
    ├── "문서/README" → /document
    └── "빌드/배포" → /build
```
