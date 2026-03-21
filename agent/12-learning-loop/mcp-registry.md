# MCP 레지스트리 — Learning Loop Agent

## 이 에이전트의 MCP 우선순위

| 순위 | MCP 서버 | 용도 | 사용 빈도 |
|------|----------|------|----------|
| 1 | **Sequential** | 진단 로직 분석, A/B 테스트 설계, 통계적 추론 | 높음 |
| 2 | **Context7** | 통계 라이브러리, Claude SDK, Next.js 패턴 | 중간 |
| 3 | **Playwright** | 배포 페이지 실시간 검증, 전환 퍼널 테스트 | 중간 |
| 4 | Magic | UI 관련 작업 거의 없음 (분석 엔진) | 낮음 |

## Sequential — 복잡한 분석 + 다단계 추론

### 용도
진단 로직 설계, A/B 테스트 통계적 분석, 전환율 최적화 전략 추론

### 활성화 조건
- 복잡한 진단 로직 설계/디버깅
- A/B 테스트 통계적 유의성 분석
- `--think` / `--think-hard` / `--ultrathink`
- `--seq` 또는 `--sequential`

### 이 에이전트의 주요 Sequential 사용 패턴
- **진단 로직 분석**: 임계값 기반 자동 진단의 정확성 검증
- **A/B 테스트 설계**: 샘플 크기 계산, 교란 변수 통제 전략
- **통계적 추론**: p-value 계산 로직 검증, 베이지안 vs 빈도주의 접근 비교
- **전환율 최적화**: 처방 효과 예측, Level 1/2/3 분류 기준

### 사고 깊이
| 플래그 | 토큰 | 용도 |
|--------|------|------|
| `--think` | ~4K | 단일 진단 임계값 디버깅, 개별 A/B 테스트 분석 |
| `--think-hard` | ~10K | 전체 진단 시스템 분석, 통계 모델 검증 |
| `--ultrathink` | ~32K | Learning Loop 아키텍처 재설계, 전환율 최적화 전략 |

### 에러 복구
- 타임아웃 → 네이티브 분석 → 제한 사항 기록

---

## Context7 — 라이브러리 문서 + 패턴

### 용도
외부 라이브러리 공식 문서, 프레임워크 패턴, 코드 예시 조회

### 활성화 조건
- 통계 라이브러리 사용법 확인
- Claude SDK 패턴 참조
- `--c7` 또는 `--context7` 플래그

### 워크플로우
```
1. resolve-library-id — 라이브러리 이름으로 ID 검색
2. get-library-docs — 특정 주제의 문서 조회
3. 패턴 추출 → 구현에 적용
```

### 이 프로젝트 주요 라이브러리
- Next.js 16 App Router | Prisma 7 | Zustand 5
- Tailwind CSS v4 | BullMQ | @anthropic-ai/sdk | @google/genai

### 이 에이전트의 주요 Context7 조회 대상
- **@anthropic-ai/sdk**: Claude 메시지 생성, JSON 모드, 비용 추적 (diagnoseMetrics 호출)
- **통계 관련**: 카이제곱 검정, z-검정 구현 패턴 (A/B 테스트 유의성)
- **Prisma 7**: 진단/처방/테스트 결과 저장, 집계 쿼리 패턴

### 에러 복구
- 라이브러리 못 찾음 → WebSearch → 직접 구현
- 타임아웃 → 캐시 지식 사용 → 제한 사항 기록

---

## Playwright — E2E 테스트 + 시각 검증

### 용도
배포 페이지 실시간 검증, 전환 퍼널 테스트, A/B variant 시각 비교

### 활성화 조건
- 배포된 페이지 전환 퍼널 검증
- A/B variant 시각적 차이 확인
- `--play` 또는 `--playwright`

### 이 에이전트에서의 사용
- **중간 빈도** — A/B 테스트 variant 시각적 차이 검증
- 배포된 페이지의 트래킹 스크립트 동작 확인
- 전환 퍼널 E2E 테스트

### 에러 복구
- 연결 실패 → Bash(curl) → 수동 테스트 요청

---

## Magic — UI 컴포넌트 생성

### 이 에이전트에서의 사용
- **거의 사용하지 않음** — Learning Loop는 분석/최적화 엔진
- 예외: 진단 결과 대시보드 UI 구현 시

### 에러 복구
- 생성 실패 → Context7 패턴 → 직접 구현

---

## 조합 패턴

| 조합 | 용도 |
|------|------|
| Sequential + Context7 | A/B 테스트 설계 시 통계 라이브러리 + 분석 추론 |
| Sequential 단독 | 진단 로직 분석, 전환율 최적화 전략 |
| Context7 단독 | Claude SDK 패턴, Prisma 쿼리 |
| Playwright 단독 | 배포 페이지 검증 |
| 전체 (--all-mcp) | 대규모 Learning Loop 재설계 시 |

## 비활성화

| 플래그 | 효과 |
|--------|------|
| `--no-mcp` | 전체 비활성화 |
| `--no-magic` | Magic만 비활성화 |
| `--no-seq` | Sequential만 비활성화 |
| `--no-c7` | Context7만 비활성화 |
| `--no-play` | Playwright만 비활성화 |

---

## MCP 효율 로그 (자동 갱신)

| MCP | 사용 횟수 | 성공률 | 가치 평가 | 마지막 사용 |
|-----|----------|--------|----------|------------|
| Sequential | 0 | - | - | - |
| Context7 | 0 | - | - | - |
| Playwright | 0 | - | - | - |
| Magic | 0 | - | - | - |

## 새 도구 탐색

> MCP 도구 탐색은 **Tool Intelligence Agent (13)**에 위임한다.
> Tool Intelligence가 `_shared/tool-broadcast.md`에 새 MCP를 공지하면, 세션 시작 프로토콜 Step 0에서 확인 후 채택/보류를 결정한다.
> 채택 시: 이 파일의 우선순위 테이블 + 효율 로그 갱신, memory.md에 채택 기록.

## 업데이트 규칙

- 매 MCP 사용 후: 효율 로그 갱신
- 새 MCP 등록 시: 이 파일 + tools.md + tool-selection.md 동시 갱신
- MCP 제거 시: fallback 체인 업데이트
- 탐색 결과: 발견 여부와 관계없이 memory.md에 기록
