# 출력 포맷 — Tool Intelligence Agent

> 12개 에이전트 공통 출력 표준을 상속하면서, 도구 추천 전용 포맷을 추가한다.

---

## 상태 리포트

### 작업 시작
```
🔄 [Agent#13] {작업명} 시작
   대상: {에이전트명 또는 "전체"}
```

### 작업 완료
```
✅ [Agent#13] {작업명} 완료
   결과: {요약 1줄}
```

### 에러
```
❌ [Agent#13] {작업명} 에러
   원인: {원인}
   조치: {계획}
```

### 경고
```
⚠️ [Agent#13] {작업명} 경고
   내용: {내용}
   권장: {조치}
```

---

## 도구 추천 포맷 (Tool Intelligence 전용)

### 추천 응답

```yaml
[TOOL_RECOMMENDATION]
  request:
    agent: "에이전트명"
    task_type: "작업 유형"
    description: "작업 설명"

  recommended_tools:
    - tier: "strong"
      type: "mcp | skill | native | cli"
      name: "도구명"
      reason: "추천 이유 (한국어 1줄)"
      score: N
      cost_warning: "MCP 비용 경고 (해당 시)"

    - tier: "alternative"
      type: "..."
      name: "..."
      reason: "..."
      score: N

    - tier: "reference"
      type: "..."
      name: "..."
      reason: "..."
      score: N

  skill_chain:
    - { order: 1, skill: "스킬명", action: "수행 내용", fallback: "대안" }
    - { order: 2, skill: "스킬명", action: "수행 내용" }

  fallback_tools:
    - { name: "도구명", reason: "폴백 이유" }

  confidence: N  # 0-100
  reasoning: "추천 근거 (한국어)"
  estimated_cost: "예상 비용 (원)"
```

### 추천 없음

```yaml
[TOOL_RECOMMENDATION]
  request:
    agent: "에이전트명"
    task_type: "작업 유형"

  recommended_tools: []
  reasoning: "추천 없음 — {사유}"
  suggestion: "대안 접근 방법"
```

---

## 브로드캐스트 포맷

### 새 도구 발견

```yaml
[NEW_TOOL]
  id: "BROADCAST-NNN"
  date: "YYYY-MM-DD"
  type: "MCP | SKILL"
  name: "도구명"
  source: "발견 소스"
  description: "도구 설명 (한국어)"
  target_agents: [에이전트 번호]
  score: N
  install: "설치 방법"
  comparison: "기존 도구 대비 차이점"
  recommendation: "① 강력 추천 | ② 대안 | ③ 참고"
  cost_warning: "MCP 비용 경고 (해당 시)"
  status: "NEW"
```

### 도구 교체 알림

```yaml
[TOOL_REPLACE]
  date: "YYYY-MM-DD"
  deprecated_tool: "퇴역 도구명"
  deprecated_reason: "퇴역 사유"
  replacement_tool: "대체 도구명"
  target_agents: [에이전트 번호]
  migration_guide: "전환 방법"
```

### 도구 deprecation 알림

```yaml
[TOOL_DEPRECATED]
  date: "YYYY-MM-DD"
  tool: "도구명"
  reason: "퇴역 사유"
  target_agents: [에이전트 번호]
  alternative: "대안 (있을 경우)"
  action_required: "에이전트 조치 필요 여부"
```

---

## 탐색 리포트 포맷

```yaml
[SCAN_REPORT]
  date: "YYYY-MM-DD"
  trigger: "트리거 유형"
  scope: "탐색 범위"
  sources_searched:
    - { source: "소스명", tier: N, results: N }
  filter_stats:
    stage_1_input: N
    stage_1_output: N
    stage_2_input: N
    stage_2_output: N
    stage_3_input: N
    stage_3_output: N
    stage_4_output: N
  broadcasts: N
  rejected: N
  duration: "소요 시간"
```

---

## 에이전트 간 핸드오프

### 성공

```yaml
[ENGINE_OUTPUT]
  engine: "13-tool-intelligence"
  agent: "Tool Intelligence Agent"
  status: "success"
  output_type: "ToolRecommendation | ScanReport | Broadcast"
  quality_score: N
  cost: 0  # 항상 0 (AI 호출 없음)
  duration: "소요 시간"
  next_engines: ["요청 에이전트"]
```

### 에러

```yaml
[ENGINE_ERROR]
  engine: "13-tool-intelligence"
  error_type: "에러 유형"
  retry_count: N
  impact:
    - "영향 에이전트 목록"
  escalation_required: true/false
```

### 경고

```yaml
[ENGINE_WARNING]
  engine: "13-tool-intelligence"
  quality_score: N
  threshold: 60
  message: "경고 내용"
```

---

## 심볼 시스템 (공통)

| 심볼 | 의미 |
|------|------|
| ✅ | 완료, 통과 |
| ❌ | 실패, 에러 |
| ⚠️ | 경고 |
| 🔄 | 진행 중 |
| ⏳ | 대기 |
| 🚨 | 긴급 |
| 📝 | 코드/문서 변경 |
| 🔍 | 탐색, 검토 |
| 💰 | 비용 |
| 💡 | 인사이트, 학습 |
| 🎯 | 목표, 결정 |

---

## 로그 레벨

| 레벨 | 용도 |
|------|------|
| INFO | 일반 정보 (기본) |
| WARN | 주의 필요 |
| ERROR | 에러 발생 |
| CRITICAL | 즉시 조치 필요 |

---

## 비용 규칙

- 모든 비용은 **한국 원화(₩)**로 표시
- Tool Intelligence 자체 비용: 항상 0원 (AI 호출 없음)
- 추천 도구의 예상 비용: estimated_cost 필드에 명시
- MCP 추천 시: cost_warning 필수 포함
