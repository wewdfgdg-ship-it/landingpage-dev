# 스킬 레지스트리 — Conversion Strategy Agent

## 이 에이전트의 스킬 우선순위

| 순위 | 스킬 | 주요 용도 | 사용 빈도 |
|------|------|----------|----------|
| 1 | **/implement** | 엔진 코드 구현 (index.ts, prompts.ts, rules.ts, types.ts) | 높음 |
| 2 | **/design** | 전략 구조 설계, 프롬프트 아키텍처 | 중간 |
| 3 | **/analyze** | 전략 유효성 분석, 타입 호환 검증, 비용 분석 | 중간 |
| 4 | **/test** | 전략 생성 테스트, 입출력 검증 | 중간 |
| 5 | **/troubleshoot** | AI 호출 실패 디버깅, JSON 파싱 에러 진단 | 낮음 |

## 내장 스킬 매핑

### /build — 프로젝트 빌드
- **자동 호출**: 코드 변경 완료 후 검증
- **동작**: 프레임워크 감지 → 빌드 → 에러 처리
- **이 프로젝트**: `npm run build` (Next.js 16)

### /implement — 기능 구현
- **자동 호출**: 새 엔진/API/컴포넌트 구현 요청
- **동작**: 페르소나 활성화 → MCP 선택 → 구현 → 검증
- **MCP**: Magic (UI), Context7 (패턴), Sequential (복잡 로직)

### /analyze — 코드 분석
- **자동 호출**: 품질/보안/성능 점검 요청
- **동작**: 다차원 분석
- **MCP**: Sequential (분석), Context7 (패턴 대조)

### /improve — 코드 개선
- **자동 호출**: 리팩토링, 최적화, 품질 개선 요청
- **MCP**: Sequential (로직), Context7 (패턴)

### /test — 테스트
- **자동 호출**: 테스트 생성/실행 요청
- **MCP**: Playwright (E2E), Sequential (전략)

### /cleanup — 정리
- **자동 호출**: 데드코드, 기술부채 감소 요청

### /design — 설계
- **자동 호출**: 시스템/API/컴포넌트 설계 요청
- **MCP**: Magic (UI), Sequential (아키텍처), Context7 (패턴)

### /troubleshoot — 문제 진단
- **자동 호출**: 버그, 에러, 성능 이슈 발생
- **MCP**: Sequential (분석), Playwright (재현)

### /explain — 설명
- **자동 호출**: 코드/개념 설명 요청

### /git — Git 워크플로우
- **자동 호출**: 커밋, PR, 브랜치 요청

### /document — 문서 생성
- **자동 호출**: 문서 작성 요청

## 자동 호출 판단 로직

```
사용자 요청 분석
    │
    ├── "구현/만들어/추가" → /implement
    ├── "분석/점검/리뷰" → /analyze
    ├── "개선/최적화/리팩토링" → /improve
    ├── "테스트/검증" → /test
    ├── "정리/삭제/제거" → /cleanup
    ├── "설계/구조" → /design
    ├── "에러/버그/안됨" → /troubleshoot
    ├── "설명/어떻게/왜" → /explain
    ├── "커밋/푸시/PR" → /git
    ├── "문서/README" → /document
    └── "빌드/배포" → /build
```

## 스킬 조합 패턴

### Conversion Strategy 엔진 구현
```
/design (전략 구조 + 프롬프트 아키텍처)
    → /implement (types.ts + rules.ts + prompts.ts + index.ts)
    → /analyze (전략 유효성 + 비용 분석)
    → /test (단위 테스트)
    → /build (빌드 검증)
```

### AI 프롬프트 디버깅
```
/troubleshoot (JSON 파싱 에러 / 누락 섹션 진단)
    → /implement (프롬프트 수정)
    → /analyze (수정 후 품질 재검증)
    → /build (빌드 확인)
```

### 코드 품질 개선
```
/analyze → /improve → /test → /build
```

### 버그 수정
```
/troubleshoot → /implement → /test → /build
```

---

## 스킬 효율 로그 (자동 갱신)

| 스킬 | 사용 횟수 | 만족도 | 마지막 사용 | 버전/출처 |
|------|----------|--------|------------|----------|
| /implement | 0 | - | - | 내장 |
| /analyze | 0 | - | - | 내장 |
| /improve | 0 | - | - | 내장 |
| /build | 0 | - | - | 내장 |
| /test | 0 | - | - | 내장 |
| /cleanup | 0 | - | - | 내장 |
| /design | 0 | - | - | 내장 |
| /troubleshoot | 0 | - | - | 내장 |
| /explain | 0 | - | - | 내장 |
| /git | 0 | - | - | 내장 |
| /document | 0 | - | - | 내장 |

## 외부 스킬 캐시

| 스킬명 | ID | 발견일 | 평가 | 설치 여부 |
|--------|-----|--------|------|----------|
| - | - | - | - | - |

## 새 스킬 탐색

> 스킬 탐색은 **Tool Intelligence Agent (13)**에 위임한다.
> Tool Intelligence가 `_shared/tool-broadcast.md`에 새 스킬을 공지하면, 세션 시작 프로토콜 Step 0에서 확인 후 채택/보류를 결정한다.
> 채택 시: 이 파일의 우선순위 테이블 + 효율 로그 갱신, memory.md에 채택 기록.

## 연동 참조

### ← tool-selection.md 호출 참조

| tool-selection.md 작업 | 이 파일의 스킬 조합 |
|-----------------------|-------------------|
| 엔진 구현 | /design → /implement → /analyze → /test → /build |
| 프롬프트 디버깅 | /troubleshoot → /implement → /analyze → /build |
| 코드 개선 | /analyze → /improve → /test → /build |
| 버그 수정 | /troubleshoot → /implement → /test → /build |

### ← workflow.md 단계 매핑

| workflow.md 단계 | 스킬 | MCP (mcp-registry.md) |
|-----------------|------|----------------------|
| 1단계 (types.ts) | /implement | — |
| 2단계 (rules.ts) | /implement | — |
| 3단계 (prompts.ts) | /implement | --c7 (Claude SDK) |
| 4단계 (index.ts) | /implement → /test | --seq (선택) |
| 5단계 (pipeline.ts) | /implement | — |
| 6단계 (검증+검수) | /test → /analyze | --seq (FAIL 시) |

### → mcp-registry.md 자동 활성화 참조

| 스킬 실행 시 | MCP 자동 활성화 조건 |
|------------|-------------------|
| /troubleshoot | Sequential (복잡한 전략 분석) |
| /analyze | Sequential (시스템 수준 분석) |
| /implement (API) | Context7 (Next.js 패턴) |
| /implement (AI 호출) | Context7 (Claude SDK 패턴) |

## 업데이트 규칙

- 스킬 사용 후: 효율 로그 갱신 (만족도 = 결과 품질 × 속도)
- 외부 스킬 발견: 캐시에 기록 (설치는 사용자 승인 필요)
- Phase 전환 시: 검색 트리거 자동 발동
- 만족도 < 60% (5회+ 사용): 대안 검색 자동 발동
