# 스킬 레지스트리 — Attention Architecture Agent

## 이 에이전트의 스킬 우선순위

| 순위 | 스킬 | 주요 용도 | 사용 빈도 |
|------|------|----------|----------|
| 1 | **/implement** | 엔진 코드 구현 (index.ts, types.ts, rules.ts) | 높음 |
| 2 | **/test** | Zone 검증 테스트, ratio/pixelRange 테스트 | 중간 |
| 3 | **/analyze** | 규칙 로직 분석, 타입 호환 검증 | 낮음 |
| 4 | **/improve** | 규칙 구조 개선 | 낮음 |
| 5 | **/troubleshoot** | 규칙 매칭 오류 디버깅 | 낮음 |

## 스킬 조합 패턴

### Attention Architecture 엔진 구현
```
/implement (rules.ts + index.ts + types.ts)
    → /test (4 Zone 검증 + ratio 합 테스트 + pixelRange 연속 테스트)
    → /build (빌드 검증)
```

---

## 스킬 효율 로그 (자동 갱신)

| 스킬 | 사용 횟수 | 만족도 | 마지막 사용 | 버전/출처 |
|------|----------|--------|------------|----------|
| /implement | 0 | - | - | 내장 |
| /test | 0 | - | - | 내장 |
| /analyze | 0 | - | - | 내장 |
| /build | 0 | - | - | 내장 |

## 외부 스킬 캐시

| 스킬명 | ID | 발견일 | 평가 | 설치 여부 |
|--------|-----|--------|------|----------|
| - | - | - | - | - |

## 새 스킬 탐색

> 스킬 탐색은 **Tool Intelligence Agent (13)**에 위임한다.
> Tool Intelligence가 `_shared/tool-broadcast.md`에 새 스킬을 공지하면, 세션 시작 프로토콜 Step 0에서 확인 후 채택/보류를 결정한다.
> 채택 시: 이 파일의 우선순위 테이블 + 효율 로그 갱신, memory.md에 채택 기록.

## 업데이트 규칙

- 스킬 사용 후: 효율 로그 갱신
- Phase 전환 시: 검색 트리거 자동 발동
