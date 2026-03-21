# 체크리스트 — Tool Intelligence Agent

> 도구 추천을 내보내기 전 반드시 실행하는 품질 검증.
> 다른 에이전트의 "코드 변경 후 체크리스트"와 달리, 이 체크리스트는 **추천 품질**을 검증한다.

---

## 자동 실행 프로토콜

```
추천 생성 완료
  │
  ▼
체크리스트 실행 (아래 항목 전부)
  │
  ▼
통과율 판정
  ├── 100% → PASS → reviewer.md로 전달
  ├── 80-99% → WARN → reviewer.md로 전달 (실패 항목 포함)
  └── <80% → FAIL → loop.md 즉시 트리거
```

---

## 필터 무결성 체크

### 1단계 하드 필터 검증
- [ ] 모든 추천 도구가 Claude Code를 지원하는가
- [ ] 모든 추천 도구의 마지막 커밋이 6개월 이내인가
- [ ] 모든 추천 도구의 GitHub Star가 50개 이상인가
- [ ] 모든 추천 도구에 README가 존재하는가
- [ ] 모든 추천 도구의 설치 방법이 명확한가

### 2단계 적합성 필터 검증
- [ ] 대상 에이전트의 엔진 타입과 추천 도구가 일치하는가
  - ⤷ 규칙 엔진에 AI 전용 MCP를 추천하지 않았는가
- [ ] 기존 MCP/스킬과 기능 중복이 없는가
- [ ] 프로젝트 스택(Next.js 16, TS strict)과 호환되는가

### 3단계 품질 점수 검증
- [ ] 모든 추천 도구의 점수가 70점 이상인가
- [ ] 가중치 적용이 올바른가 (개선도 35% + 다운로드 20% + Issue 20% + 후기 15% + 설치 10%)
- [ ] 70점 미만 도구가 추천에 포함되지 않았는가

### 4단계 최종 전달 검증
- [ ] 에이전트당 최대 3개를 초과하지 않았는가
- [ ] tier 분류가 올바른가 (strong / alternative / reference)
- [ ] 0개 통과 시 "추천 없음"으로 기록했는가
- [ ] 5개+ 에이전트 대상 도구에 사용자 승인을 요청했는가

---

## 추천 내용 체크

### 필수 필드 검증
- [ ] recommendedTools가 비어있지 않은가 (또는 "추천 없음" 명시)
- [ ] 각 ToolChoice에 name, reason, score, tier가 있는가
- [ ] skillChain이 있다면 order가 순차적인가
- [ ] fallbackTools가 1개 이상 있는가
- [ ] confidenceScore가 0-100 범위인가
- [ ] reasoning이 비어있지 않은가 (한국어)
- [ ] cost가 0 이상인가

### MCP 추천 전용 체크
- [ ] MCP 추천 시 costWarning이 포함되어 있는가
- [ ] 비용 경고문에 토큰 수치가 구체적인가
- [ ] @_shared/mcp-cost-rules.md 참조가 포함되어 있는가

### 비용 체크
- [ ] 추천 도구 조합의 총 예상 비용이 합리적인가
- [ ] AI 엔진 비용 + MCP 토큰 비용 합산이 500원 이하인가

---

## 소스 품질 체크

- [ ] 사용한 소스의 Tier가 올바른가 (Tier 1 → 2 → 3 순)
- [ ] Tier 2 이상 사용 시 Tier 1이 부족했다는 근거가 있는가
- [ ] source-registry 품질 추적 테이블을 갱신했는가

---

## 기록 체크

- [ ] memory.md에 탐색 이력을 기록했는가
- [ ] 미성택 도구를 REJECTED_LOG에 기록했는가
- [ ] 브로드캐스트 게시 시 tool-broadcast.md 형식을 준수했는가

---

## 통과율 판정

| 통과율 | 판정 | 행동 |
|--------|------|------|
| 100% | PASS | → reviewer.md 전달 |
| 80-99% | WARN | → reviewer.md 전달 (실패 항목 명시) |
| <80% | FAIL | → loop.md 즉시 트리거 |

---

## 핸드오프 형식

### PASS/WARN → reviewer.md

```yaml
[HANDOFF_TO_REVIEWER]
  agent: "13-tool-intelligence"
  checklist_pass_rate: "N%"
  recommendation_type: "탐색 추천 | 요청 응답"
  target_agents: [에이전트 번호]
  tools_recommended: N
  mcp_included: true/false
  cost_warning_included: true/false
  engine_specific_results:
    filter_integrity: true/false
    field_completeness: true/false
    mcp_cost_warning: true/false
    source_quality: true/false
    record_completeness: true/false
```

### FAIL → loop.md

```yaml
[FAIL_TRIGGER]
  agent: "13-tool-intelligence"
  checklist_pass_rate: "N%"
  failed_items:
    - "실패 항목 1"
    - "실패 항목 2"
  severity: "high | medium | low"
  engine_specific_failures:
    filter_integrity: true/false
    field_completeness: true/false
    mcp_cost_warning: true/false
```
