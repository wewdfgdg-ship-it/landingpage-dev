# 엔진 스펙 — Tool Intelligence Agent

## 엔진 메타

| 항목 | 값 |
|------|------|
| 엔진 번호 | 13 |
| 엔진 이름 | Tool Intelligence |
| 경로 | `agent/13-tool-intelligence/` |
| AI/규칙 | 규칙 기반 (AI 호출 없음) |
| 핵심 기능 | 도구 탐색 → 평가 → 추천 → 학습 |

---

## I/O 타입 정의

### Input (도구 추천 요청)

```typescript
interface ToolRequest {
  taskType: TaskType;
  taskDescription: string;
  agentName: string;           // 요청 에이전트 (01~12)
  agentEngineType: 'ai' | 'rule' | 'hybrid';
  priority: 'high' | 'medium' | 'low';
  constraints?: string[];      // 제약사항 (예: "비용 0", "속도 <1초")
}

type TaskType =
  | 'information_retrieval'    // 정보 검색
  | 'analysis'                 // 분석
  | 'generation'               // 생성 (카피, 코드 등)
  | 'code'                     // 코드 작업
  | 'image'                    // 이미지 관련
  | 'deployment'               // 배포
  | 'data'                     // 데이터 처리
  | 'testing';                 // 테스트
```

### Output (도구 추천 결과)

```typescript
interface ToolRecommendation {
  recommendedTools: ToolChoice[];      // 최대 3개
  skillChain: SkillChainStep[];        // 추천 실행 순서
  fallbackTools: ToolChoice[];         // 폴백
  confidenceScore: number;             // 0-100
  reasoning: string;                   // 추천 이유 (한국어)
  cost: number;                        // 이 추천의 예상 비용 (원)
}

interface ToolChoice {
  tier: 'strong' | 'alternative' | 'reference';  // ①강력 ②대안 ③참고
  type: 'mcp' | 'skill' | 'native' | 'cli';
  name: string;
  reason: string;              // 한국어 1줄
  score: number;               // 70-100
  costWarning?: string;        // MCP일 경우 비용 경고
}

interface SkillChainStep {
  order: number;
  skill: string;
  action: string;
  fallback?: string;
}
```

---

## 4단계 필터 알고리즘 (핵심)

### 전체 흐름

```
소스에서 후보 수집 (수십~수백 개)
  │
  ▼
1단계: 하드 필터 ──→ ~90% 제거
  │
  ▼
2단계: 적합성 필터 ──→ 남은 것의 ~80% 제거
  │
  ▼
3단계: 품질 평가 ──→ 70점 미만 제거
  │
  ▼
4단계: 최종 선택 ──→ 에이전트별 max 3개
  │
  ▼
ToolRecommendation 반환
```

### 1단계: 하드 필터 (자동 탈락)

```typescript
interface HardFilter {
  claudeCodeSupport: boolean;     // false → 즉시 탈락
  lastCommitMonths: number;       // >6 → 즉시 탈락
  githubStars: number;            // <50 → 즉시 탈락
  hasReadme: boolean;             // false → 즉시 탈락
  installClarity: boolean;        // false → 즉시 탈락
}

function applyHardFilter(candidate: RawCandidate): boolean {
  if (!candidate.claudeCodeSupport) return false;
  if (candidate.lastCommitMonths > 6) return false;
  if (candidate.githubStars < 50) return false;
  if (!candidate.hasReadme) return false;
  if (!candidate.installClarity) return false;
  return true;
}
```

### 2단계: 적합성 필터

```typescript
interface FitFilter {
  engineTypeMatch: boolean;        // 규칙 엔진에 AI MCP → false
  noFeatureOverlap: boolean;       // 기존 MCP 중복 → false
  stackCompatible: boolean;        // Next.js 16 + TS strict 필수
}

function applyFitFilter(
  candidate: FilteredCandidate,
  targetAgent: AgentProfile
): boolean {
  // 규칙 엔진에 AI 전용 MCP 추천 금지
  if (targetAgent.engineType === 'rule' && candidate.requiresAI) return false;
  // 기존 도구와 기능 중복 검사
  if (hasFeatureOverlap(candidate, targetAgent.currentTools)) return false;
  // 스택 호환성
  if (!isStackCompatible(candidate, PROJECT_STACK)) return false;
  return true;
}
```

### 3단계: 품질 평가

```typescript
interface QualityScore {
  improvementPotential: number;    // 35% — 기존 대비 개선도
  weeklyDownloads: number;         // 20% — npm 실사용량
  issueResolutionRate: number;     // 20% — 유지보수 활성도
  userReviews: number;             // 15% — 블로그/커뮤니티 리뷰
  installSimplicity: number;       // 10% — 의존성 수, 설정 난이도
}

function calculateScore(q: QualityScore): number {
  return Math.round(
    q.improvementPotential * 0.35 +
    q.weeklyDownloads * 0.20 +
    q.issueResolutionRate * 0.20 +
    q.userReviews * 0.15 +
    q.installSimplicity * 0.10
  );
}

// 70+ → 전달 대상
// <70 → 미성택 (memory.md에 기록)
```

### 4단계: 최종 선택

```typescript
function selectFinal(
  candidates: ScoredCandidate[],
  maxPerAgent: number = 3
): ToolChoice[] {
  const sorted = candidates.sort((a, b) => b.score - a.score);
  const result: ToolChoice[] = [];

  if (sorted[0]) result.push({ ...sorted[0], tier: 'strong' });
  if (sorted[1]) result.push({ ...sorted[1], tier: 'alternative' });
  if (sorted[2]) result.push({ ...sorted[2], tier: 'reference' });

  return result;
}
```

---

## 소스 레지스트리 (탐색 소스 관리)

### Tier 구조

| Tier | 소스 | 방법 | 조건 |
|------|------|------|------|
| 1 (고정) | prompts.chat (스킬) | `search_skills("{키워드}")` | 항상 탐색 |
| 1 (고정) | prompts.chat (프롬프트) | `search_prompts("{키워드}")` | 항상 탐색 |
| 2 (검증) | MCP 공식 레지스트리 | `WebSearch("MCP server {키워드} site:github.com")` | Tier 1 부족 시 |
| 2 (검증) | npm MCP 패키지 | `WebSearch("npm @anthropic {키워드}")` | 특정 라이브러리 도구 필요 시 |
| 3 (탐험) | GitHub Awesome MCP | `WebSearch("awesome MCP servers list")` | 월 1회 또는 Tier 1+2 부족 시 |
| 3 (탐험) | 블로그/커뮤니티 | `WebSearch("Claude Code MCP {키워드} 2026")` | 특정 니즈 미충족 시 |
| 3 (탐험) | Reddit/X | `WebSearch("reddit Claude Code MCP {키워드}")` | 커뮤니티 트렌드 확인 |
| Hold | (부적합 소스) | - | 90일 후 재평가 |

### 소스 품질 추적

| 소스 | 탐색 횟수 | 유용 결과 수 | 성공률 | 마지막 탐색 |
|------|----------|-------------|--------|------------|
| prompts.chat 스킬 | 0 | 0 | - | - |
| prompts.chat 프롬프트 | 0 | 0 | - | - |
| MCP 공식 레지스트리 | 0 | 0 | - | - |
| npm MCP 패키지 | 0 | 0 | - | - |
| GitHub Awesome MCP | 0 | 0 | - | - |
| 블로그/커뮤니티 | 0 | 0 | - | - |
| Reddit/X | 0 | 0 | - | - |

### Tier 승격/강등 규칙

| 조건 | 행동 |
|------|------|
| 성공률 80%+ (5회 이상) | Tier 승격 (3→2, 2→1) |
| 성공률 30% 미만 (5회 이상) | Tier 강등 (1→2, 2→3) |
| 3회 연속 결과 0건 | Hold로 이동 |
| Hold에서 90일 경과 | 재평가 (Tier 3에서 재시작) |

---

## 키워드 수집 프로토콜

### 수집 방법

```
1. agent/01~12/agent.md 읽기
2. 각 파일에서 `## Tool Intelligence 키워드` 블록 파싱
3. search_keywords.mcp[] → MCP 탐색 키워드
4. search_keywords.skill[] → 스킬 탐색 키워드
5. 공통 키워드 자동 추가 (아래 참조)
```

### 공통 키워드 (자동 추가)

모든 에이전트 키워드에 자동으로 결합하여 검색한다:
- "Claude Code MCP server"
- "Claude Code skill"
- "Next.js 16, TypeScript, Tailwind v4"

### 규칙
- **키워드 소유권**: 각 에이전트 본인이 선언 (Tool Intelligence는 읽기만)
- **갱신 시점**: Phase 전환, 새 작업 유형 시, 도구 실패 시

---

## 타입 호환성 매핑

### 요청 에이전트 → Tool Intelligence

| 에이전트 | 제공 데이터 | 매핑 |
|---------|-----------|------|
| 01~12 | task_type + constraints | ToolRequest 구성 |
| Pipeline | phase 정보 | 트리거 #3 (Phase 전환) |
| skill-feedback.md | 실패 기록 | 트리거 #5 (실패 누적) |

### Tool Intelligence → 대상 에이전트

| 출력 | 소비 대상 | 매핑 |
|------|---------|------|
| ToolRecommendation | 요청 에이전트 | 직접 반환 |
| [NEW_TOOL] broadcast | 전체 에이전트 | tool-broadcast.md 게시 |
| deprecation 알림 | 해당 에이전트 | tool-broadcast.md 게시 |

---

## 섹션 에이전트 도구 공급 (2026-03-09 추가)

> ⑬ Tool Intelligence가 26개 섹션 에이전트(agent/sections/S-01~S-26)에도 도구를 공급합니다.

### 대상 확장
- 기존: 에이전트 ①~⑫
- 변경: 에이전트 ①~⑫ + 섹션 에이전트 S-01~S-26

### 섹션 에이전트 태그
```yaml
section_agents_tags:
  - layout, pattern, responsive, css
  - copywriting, persuasion, korean
  - design-tokens, color, typography
  - image-generation, prompt-engineering
  - animation, motion, interaction
```

## 품질 기준

### PASS
- recommendedTools 1개 이상
- confidenceScore >= 60
- 모든 추천 도구 score >= 70
- MCP 추천 시 costWarning 포함
- reasoning 비어있지 않음

### WARN
- recommendedTools 0개 (추천 없음)
- confidenceScore 40-59
- fallbackTools만 존재

### FAIL
- 필터 단계 스킵
- 70점 미만 도구 추천
- MCP 비용 경고 누락
- 에이전트당 3개 초과 추천
- 적합성 필터 무시 (규칙 엔진에 AI MCP 추천)
