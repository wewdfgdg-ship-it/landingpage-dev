# 도구 브로드캐스트 — Tool Intelligence → 전체 에이전트

> Tool Intelligence Agent가 새 도구를 발견하면 이 파일에 [NEW_TOOL] 블록을 추가한다.
> 각 에이전트는 세션 시작 시 이 파일을 확인하고 자율 채택한다.
> 채택한 에이전트는 자신의 memory.md에 채택 기록을 남긴다.

---

## 읽기 규칙 (각 에이전트용)

```
세션 시작 프로토콜 Step 0:
    1. 이 파일 읽기
    2. [NEW_TOOL] 블록 중 자신의 에이전트 번호가 target_agents에 포함된 것 필터
    3. 해당 도구가 자신의 mcp-registry.md 또는 skill-registry.md에 이미 있으면 → SKIP
    4. 없으면 → 평가 후 채택/보류 결정
    5. 채택 시: 자신의 registry 파일 갱신 + memory.md에 채택 기록
    6. 보류 시: memory.md에 "보류" 기록 (사유 포함)
```

---

## 브로드캐스트 목록

> Tool Intelligence가 아래에 [NEW_TOOL] 블록을 추가한다. 최신 항목이 위에 온다.
> 60일 경과한 블록은 Tool Intelligence가 아카이브 섹션으로 이동한다.

(아직 브로드캐스트 없음)

<!-- 예시 포맷:
---
[NEW_TOOL]
id: BRD-001
date: 2026-03-15
type: MCP | SKILL
name: "도구 이름"
source: "발견 소스 (Tier)"
description: "한 줄 설명"
target_agents: [1, 3, 5]  # 대상 에이전트 번호
score: 82  # 평가 점수 (70+만 브로드캐스트)
version: "1.2.3"  # npm info로 확인한 최신 버전 (필수)
install: "설치 방법 한 줄"
compare: "기존 대비 개선점"
intelligence_note: "Tool Intelligence의 추천 코멘트"
status: NEW | ADOPTED(3) | EXPIRED
---
-->

---

## 아카이브 (60일+ 경과)

(아직 아카이브 없음)

---

## 통계

- 총 브로드캐스트: 0
- 채택된 도구: 0
- 보류된 도구: 0
- 만료된 도구: 0
