# 워크플로우 — Tool Intelligence Agent

## 파이프라인 위치

```
12개 실행 에이전트 파이프라인:

[사용자 입력]
  → ① Product Intelligence (AI×3)
  → ② Why Now (규칙)
  → ③ Conversion Strategy (AI×1)
  → ④ Objection Killer (규칙)
  → ⑤ Psychological Copy (AI×1+retry) ★
  → ⑥ Trust Architecture (규칙)
  → ⑦ Attention Architecture (규칙)
  → ⑧ Layout Intelligence (규칙)
  → ⑨ Visual Style (규칙)
  → Image Generation (Gemini×N)
  → ⑩ Code Engine (규칙)
  → ⑪ Deploy (규칙)
  → ⑫ Learning Loop (AI×1)

메타 레이어 (파이프라인 위가 아니라 옆에 존재):

  ⑬ Tool Intelligence ←→ 12개 에이전트 전체
      ↑ 요청: "이 작업에 최적 도구 추천"
      ↓ 응답: ToolRecommendation
      → 결과 피드백 → 학습 누적
```

### Tool Intelligence의 위치 특성

| 항목 | 값 |
|------|------|
| 파이프라인 내 순서 | 없음 (메타 레이어) |
| 실행 조건 | 에이전트 요청 또는 6개 트리거 조건 충족 |
| 실행 타이밍 | 비동기 — 파이프라인 실행과 독립 |
| 의존 엔진 | 없음 (독립 실행) |
| 의존하는 엔진 | 없음 (추천만 제공, 채택은 각 에이전트) |

---

## 실행 흐름

### A. 자동 탐색 흐름 (주기적)

```
[트리거 감지]
  │
  ▼
Step 1. 조건 확인
  memory.md → 마지막 탐색일 (7일 TTL)
  skill-feedback.md → 실패 누적 확인
  → 조건 미충족 시 "탐색 불필요" 기록 후 종료
  │
  ▼
Step 2. 키워드 수집
  agent/01~12/agent.md → `## Tool Intelligence 키워드` 파싱
  공통 키워드 자동 추가
  │
  ▼
Step 3. 소스별 탐색
  Tier 1 (prompts.chat) → search_skills / search_prompts
  Tier 2 (GitHub/npm) → WebSearch (Tier 1 부족 시에만)
  Tier 3 (커뮤니티) → WebSearch (Tier 1+2 부족 시에만)
  │
  ▼
Step 4. 4단계 필터링
  하드 → 적합성 → 품질(70+) → 최종(max 3/에이전트)
  │
  ▼
Step 5. 브로드캐스트
  _shared/tool-broadcast.md에 [NEW_TOOL] 게시
  │
  ▼
Step 6. 기록
  memory.md → 탐색 이력 + 필터링 통계
  source-registry → 소스 성공률 갱신
  skill-registry.md → 카탈로그 업데이트 (신규 도구는 trial 상태)
  │
  ▼
Step 7. 피드백 학습 (다음 세션에서 처리)
  skill-feedback.md 확인 → 추천 도구 실행 결과 수집
  성공 → trial → active 승격 (skill-registry.md)
  3회+ 연속 성공 → skill-chains.md에 체인 자동 등록
  실패 → 실패 패턴 기록 + 대체 도구 탐색 트리거
```

### B. 지연 응답 흐름 (비동기 요청-응답)

> **물리적 채널**: 에이전트가 `_shared/skill-feedback.md`에 요청 기록
> → TI가 다음 세션 시작 시 읽고 처리 → `_shared/tool-broadcast.md`로 결과 게시
> (실시간 RPC가 아니라 파일 기반 비동기 통신)

```
[에이전트 요청]
  에이전트가 skill-feedback.md에 기록:
    { taskType, agentName, constraints, status: "NEED_TOOL" }
  │
  ▼
Step 1. 문제 유형 분석 (TI 다음 세션에서 처리)
  taskType → 도구 카테고리 매핑
  agentEngineType → 적합성 필터 기준 설정
  매칭 기준: taskType (8유형) → agentName → tags 순
  │
  ▼
Step 2. 패턴 탐색
  memory.md → 유사 성공 패턴 검색
  skill-registry.md → 기존 검증 도구 확인
  mcp-registry.md → MCP 효율 확인
  │
  ▼
Step 3. 후보 평가
  tool-selection.md → 7축 선택 기준 적용
  기존 패턴 매칭 → 신규 탐색 불필요 시 즉시 반환
  │
  ▼
Step 4. 체인 설계
  단일 도구 → 단독 추천
  복합 작업 → 스킬 체인 설계 (순서 + fallback)
  │
  ▼
Step 5. 추천 반환
  tool-broadcast.md에 [TOOL_RESPONSE] 게시
  ToolRecommendation 구성 + confidenceScore 산출
  │
  ▼
Step 6. 결과 기록 + 피드백 학습
  에이전트가 skill-feedback.md에 실행 결과 기록
  성공/실패 → memory.md 패턴 업데이트
  │
  ▼
Step 7. 성공 시 승격 처리
  성공 → trial → active 승격 (skill-registry.md 갱신)
  3회+ 연속 성공 → skill-chains.md에 체인 자동 등록
  실패 → fallback 안내 + 실패 패턴 기록
```

---

## 6개 트리거 조건

| # | 트리거 | 유형 | 우선순위 |
|---|--------|------|---------|
| ① | 마지막 탐색에서 7일 경과 (캐시 TTL) | 정기 | 보통 |
| ② | 새 라이브러리 추가 (package.json 변경) | 이벤트 | 높음 |
| ③ | Phase 전환 발생 (workflow Phase 변경) | 이벤트 | 높음 |
| ④ | 에이전트 도구 실패 보고 (memory.md) | 이벤트 | 높음 |
| ⑤ | skill-feedback.md 실패 누적 3건+ | 자동 | 긴급 |
| ⑥ | "해결 불가" 기록 발생 | 긴급 | 최우선 (TTL 무시) |

### 동시 트리거 병합 규칙

- 복수 트리거 동시 충족 시 **⑥ 최우선** → ⑤ → ④ → ②③ → ① 순으로 우선순위 결정
- 낮은 우선순위 트리거의 키워드/대상을 **병합**하여 한 번의 탐색으로 처리
- 예: ① TTL 만료 + ④ 에이전트 실패 → ④ 우선순위로 실행, ①의 전체 키워드도 포함

---

## Phase별 역할

| Phase | 기간 | Tool Intelligence 역할 |
|-------|------|----------------------|
| Phase 0 기반 | 1주 (완료) | 에이전트 문서 생성 |
| Phase 1 MVP | 3주 | 엔진 1/2/3/5 도구 최적화, Claude SDK 패턴 |
| Phase 2 디자인 | 2주 | 엔진 8/9/10 도구 최적화, UI/CSS 패턴 |
| Phase 3 에디터 | 2주 | 엔진 4/6/7/11 도구 최적화 |
| Phase 4 분석 | 2주 | 엔진 12 도구 최적화, 통계/A/B 도구 |
| Phase 5 비즈니스 | 1주 | 전체 도구 효율 리포트 |

---

## 에러 처리

| 상황 | 처리 |
|------|------|
| Tier 1 소스 접속 불가 | Tier 2로 폴백 + 사용자 알림 |
| 모든 소스 결과 0건 | "추천 없음" 기록, 키워드 재검토 제안 |
| 필터 통과 도구 0개 | "필터 기준 미달" 기록, 기준 완화 검토 |
| 추천 도구 실행 실패 | fallback 도구 안내, 실패 패턴 기록 |
| memory.md 손상 | 기본 상태로 초기화, 사용자 알림 |

---

## 성능 목표

| 지표 | 목표 |
|------|------|
| 추천 응답 시간 | <5초 (패턴 매칭) / <30초 (신규 탐색) |
| 추천 정확도 | >= 70% (실행 성공률) |
| 도구 갱신 주기 | 7일 이내 |
| 에이전트당 추천 수 | max 3개 |
| 비용 | 0원 (AI 호출 없음) |
