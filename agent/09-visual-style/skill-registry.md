# 스킬 레지스트리 — Visual Style Agent

## 이 에이전트의 스킬 우선순위

| 순위 | 스킬 | 주요 용도 | 사용 빈도 |
|------|------|----------|----------|
| 1 | **/implement** | 엔진 코드 구현 (index.ts, types.ts, mood-presets.ts, rules.ts) | 높음 |
| 2 | **/design** | 무드 프리셋 설계, 디자인 토큰 구조 | 중간 |
| 3 | **/test** | 무드 매핑 테스트, 토큰 완전성 테스트 | 중간 |
| 4 | **/analyze** | 색상 대비율 분석, 토큰 효율 분석 | 낮음 |
| 5 | **/improve** | 무드 프리셋 개선, 색상 조합 최적화 | 낮음 |

## 스킬 조합 패턴

### Visual Style 엔진 구현
```
/design (무드 프리셋 + 토큰 구조 설계)
    → /implement (mood-presets.ts + rules.ts + index.ts + types.ts)
    → /test (10종 무드 매핑 + 12색 완전성 + 9레벨 타이포 + 6단계 스페이싱)
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
