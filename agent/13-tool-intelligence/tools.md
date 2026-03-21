# 도구 카탈로그 — Tool Intelligence Agent

> 12개 에이전트 + Tool Intelligence가 사용 가능한 전체 도구 목록.
> 각 도구의 메타데이터(capability, strength, weakness, cost, reliability)를 관리한다.

---

## Claude Code 네이티브 도구 (10개, 무료)

| 도구 | 용도 | 비용 | 신뢰도 |
|------|------|------|--------|
| Read | 파일 읽기 (Write/Edit 전 필수) | 무료 | 최상 |
| Write | 새 파일 생성 또는 전체 덮어쓰기 | 무료 | 최상 |
| Edit | 파일 부분 수정 (old_string → new_string) | 무료 | 최상 |
| Glob | 파일명 패턴 검색 (예: `**/*.ts`) | 무료 | 최상 |
| Grep | 파일 내용 정규식 검색 | 무료 | 최상 |
| Bash | 셸 명령 실행 | 무료 | 높음 |
| Agent | 서브 에이전트 위임 | 무료 | 높음 |
| TodoWrite | 작업 리스트 관리 | 무료 | 최상 |
| WebSearch | 웹 검색 (최신 정보) | 무료 | 중간 |
| WebFetch | URL 내용 가져오기 | 무료 | 중간 |

### 네이티브 도구 메타데이터

```yaml
Read:
  capability: "파일 내용 읽기, 이미지/PDF 지원"
  strength: "정확한 파일 내용, 라인 번호 포함"
  weakness: "디렉토리 읽기 불가 (Bash ls 사용)"
  speed: "즉시"
  cost: 0
  reliability: 99%

Write:
  capability: "새 파일 생성 또는 전체 덮어쓰기"
  strength: "전체 파일 제어"
  weakness: "기존 파일 먼저 Read 필수"
  speed: "즉시"
  cost: 0
  reliability: 99%

Edit:
  capability: "파일 부분 수정"
  strength: "diff만 전송, 효율적"
  weakness: "old_string이 유일해야 함"
  speed: "즉시"
  cost: 0
  reliability: 95%

Glob:
  capability: "파일 패턴 검색"
  strength: "빠른 파일 찾기"
  weakness: "내용 검색 불가"
  speed: "즉시"
  cost: 0
  reliability: 99%

Grep:
  capability: "정규식 기반 내용 검색"
  strength: "정확한 패턴 매칭"
  weakness: "복잡한 멀티라인은 multiline 옵션 필요"
  speed: "즉시"
  cost: 0
  reliability: 98%

Bash:
  capability: "셸 명령 실행"
  strength: "시스템 명령, CLI 도구 사용"
  weakness: "파괴적 명령 주의, 타임아웃 120초"
  speed: "가변"
  cost: 0
  reliability: 90%

Agent:
  capability: "서브 에이전트 위임"
  strength: "병렬 작업, 컨텍스트 보호"
  weakness: "토큰 소모, 결과 요약 필요"
  speed: "가변"
  cost: 0
  reliability: 85%

TodoWrite:
  capability: "작업 리스트 CRUD"
  strength: "진행 추적, 상태 관리"
  weakness: "단순 작업에는 과도"
  speed: "즉시"
  cost: 0
  reliability: 99%

WebSearch:
  capability: "웹 검색"
  strength: "최신 정보 접근"
  weakness: "결과 품질 가변적"
  speed: "2-5초"
  cost: 0
  reliability: 75%

WebFetch:
  capability: "URL 내용 가져오기"
  strength: "특정 페이지 직접 접근"
  weakness: "동적 페이지 제한"
  speed: "2-5초"
  cost: 0
  reliability: 70%
```

---

## MCP 서버 (4개, 토큰 비용)

| MCP | 용도 | 활성화 | 비용 |
|-----|------|--------|------|
| Context7 | 라이브러리 공식 문서 조회 | `--c7` | 토큰 |
| Sequential | 복잡한 다단계 분석/추론 | `--seq` | 토큰 |
| Magic | UI 컴포넌트 생성/디자인 시스템 | `--magic` | 토큰 |
| Playwright | E2E 테스트/브라우저 자동화 | `--play` | 토큰 |

### MCP 메타데이터

```yaml
Context7:
  capability: "외부 라이브러리 공식 문서 조회"
  strength: "정확한 공식 문서, 코드 예제"
  weakness: "내부 코드 패턴은 모름"
  speed: "3-10초"
  cost: "~300토큰/턴 (켜져있는 동안)"
  reliability: 85%
  workflow: "resolve-library-id → get-library-docs"
  best_for: ["외부 SDK 문서", "프레임워크 패턴", "API 레퍼런스"]

Sequential:
  capability: "복잡한 다단계 추론/분석"
  strength: "체계적 문제 분해, 깊은 분석"
  weakness: "단순 작업에는 과도"
  speed: "5-30초"
  cost: "~500토큰/턴"
  reliability: 80%
  thinking_depths:
    think: "~4K 토큰 (모듈 수준)"
    think-hard: "~10K 토큰 (시스템 수준)"
    ultrathink: "~32K 토큰 (아키텍처 수준)"
  best_for: ["복잡한 디버깅", "아키텍처 분석", "성능 병목 분석"]

Magic:
  capability: "UI 컴포넌트 생성, 디자인 시스템 통합"
  strength: "모던 UI 패턴, 반응형 디자인"
  weakness: "백엔드/분석 작업에 부적합"
  speed: "5-15초"
  cost: "~400토큰/턴"
  reliability: 80%
  best_for: ["UI 컴포넌트", "디자인 시스템", "반응형 레이아웃"]

Playwright:
  capability: "크로스 브라우저 E2E 테스트, 자동화"
  strength: "실제 브라우저 환경 테스트"
  weakness: "설정 복잡, 속도 느림"
  speed: "10-60초"
  cost: "~400토큰/턴"
  reliability: 75%
  best_for: ["E2E 테스트", "시각적 검증", "성능 측정"]
```

---

## 빌트인 스킬 (11개)

| 스킬 | 용도 | 비용 |
|------|------|------|
| /build | 빌드, 컴파일, 패키징 | 무료 |
| /implement | 기능 구현, 코드 작성 | 무료 |
| /analyze | 코드 품질, 보안, 성능 분석 | 무료 |
| /improve | 코드 품질/성능/유지보수성 개선 | 무료 |
| /test | 테스트 실행, 커버리지 관리 | 무료 |
| /cleanup | 데드 코드 제거, 구조 최적화 | 무료 |
| /design | 시스템 아키텍처, API 설계 | 무료 |
| /troubleshoot | 문제 진단, 이슈 해결 | 무료 |
| /explain | 코드/개념 설명 | 무료 |
| /git | Git 워크플로우 관리 | 무료 |
| /document | 문서 생성 | 무료 |

---

## 프로젝트 CLI 명령

### 검증
- `npx tsc --noEmit` — TypeScript 타입 체크
- `npm run lint` — ESLint
- `npm run build` — 프로덕션 빌드

### 개발
- `npm run dev` — 개발 서버 (localhost:3000)
- `npm run worker` — BullMQ 워커

### 데이터베이스
- `npx prisma db push` — 스키마 푸시
- `npx prisma generate` — 클라이언트 생성

### 테스트
- `npm run test:e2e` — E2E 테스트

---

## 외부 도구 검색 방법

### MCP 검색
```
WebSearch("Claude Code MCP server {키워드}")
WebSearch("npm @anthropic {키워드}")
```

### 스킬 검색
```
search_skills("{작업 유형}")    → 스킬 후보 목록
get_skill("{skill_id}")        → 스킬 상세 정보
search_prompts("{키워드}")     → 프롬프트 후보 목록
```

---

## 도구 성능 로그 (자동 갱신)

> 각 에이전트의 memory.md에서 수집하여 여기에 집계한다.

| 도구 | 사용 횟수 | 성공률 | 평균 시간 | 마지막 사용 |
|------|----------|--------|----------|------------|
| Read | 0 | - | - | - |
| Write | 0 | - | - | - |
| Edit | 0 | - | - | - |
| Glob | 0 | - | - | - |
| Grep | 0 | - | - | - |
| Bash | 0 | - | - | - |
| Context7 | 0 | - | - | - |
| Sequential | 0 | - | - | - |
| Magic | 0 | - | - | - |
| Playwright | 0 | - | - | - |

---

## Tool Intelligence 전용 도구 사용 범위

### 사용 가능
- Read, Glob, Grep — 에이전트 문서 읽기, 키워드 파싱
- WebSearch, WebFetch — 도구 탐색
- Edit, Write — agent/ 폴더 내 문서 갱신
- TodoWrite — 탐색 작업 추적

### 사용 제한
- Context7 — 발견 도구 문서 확인 시에만 (즉시 OFF)
- Sequential — 복잡한 적합성 분석 시에만 (즉시 OFF)

### 사용 금지
- Magic — UI 생성 안 함
- Playwright — 브라우저 사용 안 함
- Bash — src/ 코드 빌드/실행 안 함 (agent/ 문서만 다룸)
