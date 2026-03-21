# 스킬 레지스트리 — Learning Loop Agent

## 이 에이전트의 스킬 우선순위

| 순위 | 스킬 | 주요 용도 | 사용 빈도 |
|------|------|----------|----------|
| 1 | **/analyze** | 메트릭 분석, 전환율 진단, A/B 테스트 결과 평가 | 높음 |
| 2 | **/troubleshoot** | 진단 로직 에러, 통계 계산 오류, A/B 교란 변수 | 높음 |
| 3 | **/test** | 진단 임계값 테스트, A/B 통계 검증, 처방 레벨 테스트 | 중간 |
| 4 | **/implement** | 진단 로직 구현 (index.ts, prompts.ts, rules.ts, types.ts) | 중간 |
| 5 | **/improve** | 진단 정확도 개선, 통계 모델 최적화 | 낮음 |

## 내장 스킬 매핑

### /build — 프로젝트 빌드
- **자동 호출**: 코드 변경 완료 후 검증
- **동작**: 프레임워크 감지 → 빌드 → 에러 처리
- **이 프로젝트**: `npm run build` (Next.js 16)

### /implement — 기능 구현
- **자동 호출**: 진단/처방/A/B 테스트 로직 구현 요청
- **동작**: 페르소나 활성화 → MCP 선택 → 구현 → 검증
- **MCP**: Sequential (분석 로직), Context7 (Claude SDK, 통계)

### /analyze — 코드 분석
- **자동 호출**: 메트릭 분석, 전환율 진단 요청
- **동작**: 다차원 분석
- **MCP**: Sequential (분석), Context7 (통계 패턴)

### /improve — 코드 개선
- **자동 호출**: 진단 정확도, 통계 모델 개선 요청
- **MCP**: Sequential (로직), Context7 (패턴)

### /test — 테스트
- **자동 호출**: 진단/처방/A/B 테스트 로직 테스트 요청
- **MCP**: Playwright (배포 페이지 검증), Sequential (통계 검증)

### /cleanup — 정리
- **자동 호출**: 만료된 테스트 정리, 중복 진단 제거 요청

### /design — 설계
- **자동 호출**: Learning Loop 아키텍처, 진단 시스템 설계 요청
- **MCP**: Sequential (아키텍처), Context7 (패턴)

### /troubleshoot — 문제 진단
- **자동 호출**: 진단 로직 에러, 통계 계산 오류 발생
- **MCP**: Sequential (분석), Context7 (통계)

### /explain — 설명
- **자동 호출**: 진단 결과, A/B 테스트 원리, 통계 개념 설명 요청

### /git — Git 워크플로우
- **자동 호출**: 커밋, PR, 브랜치 요청

### /document — 문서 생성
- **자동 호출**: Learning Loop 문서화 요청

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

### Learning Loop 엔진 구현
```
/design (진단 시스템 + A/B 테스트 아키텍처)
    → /implement (prompts.ts + rules.ts + index.ts + types.ts)
    → /analyze (진단 정확도 + 비용 분석)
    → /test (임계값 테스트 + 통계 검증)
    → /build (빌드 검증)
```

### 진단 로직 디버깅
```
/troubleshoot (잘못된 진단 / 임계값 오류)
    → /analyze (메트릭 데이터 재분석)
    → /implement (임계값 조정 / 로직 수정)
    → /test (수정 후 검증)
    → /build (빌드 확인)
```

### A/B 테스트 결과 분석
```
/analyze (테스트 결과 통계 분석)
    → /troubleshoot (교란 변수 있으면 진단)
    → /implement (winningPattern 추출 로직)
    → /build (빌드 확인)
```

### 코드 품질 개선
```
/analyze → /improve → /test → /build
```

---

## 스킬 효율 로그 (자동 갱신)

| 스킬 | 사용 횟수 | 만족도 | 마지막 사용 | 버전/출처 |
|------|----------|--------|------------|----------|
| /analyze | 0 | - | - | 내장 |
| /troubleshoot | 0 | - | - | 내장 |
| /test | 0 | - | - | 내장 |
| /implement | 0 | - | - | 내장 |
| /improve | 0 | - | - | 내장 |
| /build | 0 | - | - | 내장 |
| /cleanup | 0 | - | - | 내장 |
| /design | 0 | - | - | 내장 |
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

## 업데이트 규칙

- 스킬 사용 후: 효율 로그 갱신 (만족도 = 결과 품질 × 속도)
- 외부 스킬 발견: 캐시에 기록 (설치는 사용자 승인 필요)
- Phase 전환 시: 검색 트리거 자동 발동
- 만족도 < 60% (5회+ 사용): 대안 검색 자동 발동
