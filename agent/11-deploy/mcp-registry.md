# MCP 레지스트리 — Deploy Agent

## 이 에이전트의 MCP 우선순위

| 순위 | MCP 서버 | 용도 | 사용 빈도 |
|------|----------|------|----------|
| 1 | - | 거의 사용하지 않음 (단순 규칙 엔진, R2 업로드 + DB 저장) | - |
| 2 | Context7 | R2 SDK, Prisma 패턴 참조 시 | 낮음 |
| 3 | Sequential | 배포 실패 복잡 디버깅 시 | 낮음 |
| 4 | Magic | 사용하지 않음 (UI 관련 없음) | 없음 |
| 5 | Playwright | 배포 후 페이지 시각 검증 시 | 낮음 |

## Context7 — 라이브러리 문서 + 패턴

### 용도
외부 라이브러리 공식 문서, 프레임워크 패턴, 코드 예시 조회

### 활성화 조건
- R2 SDK 사용법 확인 필요 시
- Prisma 배포 기록 저장 패턴
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
- **@aws-sdk/client-s3** (또는 R2 호환 SDK): R2 업로드 패턴, Content-Type 설정
- **Prisma 7**: 배포 기록 생성/조회, 트랜잭션 패턴

### 에러 복구
- 라이브러리 못 찾음 → WebSearch → 직접 구현
- 타임아웃 → 캐시 지식 사용 → 제한 사항 기록

---

## Sequential — 복잡한 분석 + 다단계 추론

### 용도
복잡한 디버깅, 배포 실패 원인 분석

### 활성화 조건
- R2 업로드 반복 실패
- 복잡한 네트워크 에러 분석
- `--seq` 또는 `--sequential`

### 이 에이전트에서의 사용
- **거의 사용하지 않음** — Deploy는 단순 규칙 엔진
- 예외: R2 업로드 반복 실패, slug 충돌 패턴 분석 시

### 에러 복구
- 타임아웃 → 네이티브 분석 → 제한 사항 기록

---

## Magic — UI 컴포넌트 생성

### 이 에이전트에서의 사용
- **사용하지 않음** — Deploy 엔진은 UI 관련 작업 없음

---

## Playwright — E2E 테스트 + 시각 검증

### 이 에이전트에서의 사용
- **낮은 빈도** — 배포 후 페이지 접근성/시각 검증 시에만 사용
- 배포된 URL에 접근하여 페이지 로딩 확인

### 에러 복구
- 연결 실패 → curl로 URL 접근 테스트 → 수동 확인 요청

---

## 조합 패턴

| 조합 | 용도 |
|------|------|
| Context7 단독 | R2 SDK / Prisma 패턴 조회 |
| Sequential 단독 | 배포 실패 복잡 디버깅 |
| Playwright 단독 | 배포 후 페이지 검증 |
| 전체 (--all-mcp) | 이 에이전트에서는 불필요 |

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
| Context7 | 0 | - | - | - |
| Sequential | 0 | - | - | - |
| Magic | 0 | - | - | - |
| Playwright | 0 | - | - | - |

## 새 도구 탐색

> MCP 도구 탐색은 **Tool Intelligence Agent (13)**에 위임한다.
> Tool Intelligence가 `_shared/tool-broadcast.md`에 새 MCP를 공지하면, 세션 시작 프로토콜 Step 0에서 확인 후 채택/보류를 결정한다.
> 채택 시: 이 파일의 우선순위 테이블 + 효율 로그 갱신, memory.md에 채택 기록.

## 업데이트 규칙

- 매 MCP 사용 후: 효율 로그 갱신
- 새 MCP 등록 시: 이 파일 + tools.md + tool-selection.md 동시 갱신
- MCP 제거 시: fallback 체인 업데이트
- 탐색 결과: 발견 여부와 관계없이 memory.md에 기록
