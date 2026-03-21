# 스킬 레지스트리 — Layout Intelligence Agent

## 이 에이전트의 스킬 우선순위

| 순위 | 스킬 | 주요 용도 | 사용 빈도 |
|------|------|----------|----------|
| 1 | **/implement** | 엔진 코드 구현 (index.ts, types.ts, rules.ts) | 높음 |
| 2 | **/design** | 레이아웃 패턴 설계, 28+ 패턴 구조 | 중간 |
| 3 | **/test** | 패턴 매핑 테스트, diversity 검증 | 중간 |
| 4 | **/analyze** | 패턴 효율 분석, Zone 배정 분석 | 낮음 |
| 5 | **/improve** | 패턴 매핑 규칙 개선 | 낮음 |

## 스킬 조합 패턴

### Layout Intelligence 엔진 구현
```
/design (패턴 구조 설계)
    → /implement (rules.ts + index.ts + types.ts)
    → /test (패턴 매핑 + diversity + mobileReady 테스트)
    → /build (빌드 검증)
```

---

## 스킬 효율 로그 (자동 갱신)

| 스킬 | 사용 횟수 | 만족도 | 마지막 사용 | 버전/출처 |
|------|----------|--------|------------|----------|
| /implement | 0 | - | - | 내장 |
| /design | 0 | - | - | 내장 |
| /test | 0 | - | - | 내장 |
| /build | 0 | - | - | 내장 |

## 새 스킬 탐색

> 스킬 탐색은 **Tool Intelligence Agent (13)**에 위임한다.
> Tool Intelligence가 `_shared/tool-broadcast.md`에 새 스킬을 공지하면, 세션 시작 프로토콜 Step 0에서 확인 후 채택/보류를 결정한다.
> 채택 시: 이 파일의 우선순위 테이블 + 효율 로그 갱신, memory.md에 채택 기록.

## 업데이트 규칙

- 스킬 사용 후: 효율 로그 갱신
