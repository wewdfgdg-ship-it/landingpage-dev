# 도구 선택 — Trust Architecture Agent

## 기본 의사결정 트리

### 파일 찾기
```
파일명/경로 알고 있음?
├── YES → Glob("패턴")
└── NO → Glob("**/*키워드*") 또는 Agent(Explore)
```

### 코드 수정
```
변경 범위?
├── 파일 일부 → Edit(old_string, new_string)
├── 파일 전체 재작성 → Write (Read 먼저!)
└── 새 파일 생성 → Write
```

## 엔진 특화 도구 조합

### 주요 작업 시퀀스: Trust Architecture 엔진 구현

```
1. Read(src/engine/06-trust-architecture/types.ts)
   → 입출력 타입 구조 확인
   │
2. Write(src/engine/06-trust-architecture/rules.ts)
   → 신뢰 요소 선정 규칙 정의
   │
3. Write(src/engine/06-trust-architecture/index.ts)
   → runTrustArchitecture 함수 구현
   → 규칙 매칭 + level/sectionOrder 클램핑 + trustScore 산출
   │
4. Bash("npx tsc --noEmit")
   → 타입 체크
   │
5. Bash("npm run build")
   → 빌드 검증
```

### 규칙 매칭 검증 시퀀스

```
1. Read(src/engine/06-trust-architecture/rules.ts)
   → 규칙 정의 확인
   │
2. Read(src/engine/06-trust-architecture/index.ts)
   → 규칙 적용 로직 확인
   │
3. [오류 발견 시] Edit(rules.ts 또는 index.ts)
   → 수정
   │
4. Bash("npx tsc --noEmit")
   → 타입 호환 재확인
```

## 작업 유형별 자동 매핑

| 작업 | 1차 도구 | 2차 도구 | MCP |
|------|----------|----------|-----|
| 엔진 구현 | Write/Edit | Bash(tsc) | - |
| 규칙 수정 | Read(rules.ts) → Edit | Bash(tsc) | - |
| 타입 호환 검증 | Grep → Read | Edit | - |
| 버그 수정 | Grep → Read → Edit | Bash(tsc) | - |

## Fallback 체인

| 1차 시도 | 실패 시 | 최종 대안 |
|----------|---------|----------|
| 직접 구현 | Context7 패턴 참조 | 사용자에게 질문 |

## 선택 기록 (자동 누적)

| 날짜 | 작업 유형 | 선택한 조합 | 결과 | 소요 시간 |
|------|----------|------------|------|----------|
| - | - | - | - | - |

## 통합 참조: mcp-registry.md 매핑

| 작업 유형 | MCP 서버 | 활성화 조건 |
|----------|---------|-----------|
| 규칙 엔진 구현 | 없음 | 외부 라이브러리 불필요 |
| 복잡한 디버깅 | Sequential (--seq) | FAIL 판정 후 디버깅 시 |
| 타입 호환 확인 | 없음 | 직접 Read → Grep |

## 통합 참조: skill-registry.md 조합

| 작업 유형 | 스킬 조합 | 비고 |
|----------|----------|------|
| 규칙 엔진 구현 | Write → Bash(tsc) | AI 스킬 불필요 |
| 규칙 검증 | Read → Edit → Bash(tsc) | 결정론적 테스트 |
| 파이프라인 연결 | Grep → Read → Edit | pipeline.ts 수정 |

## 통합 참조: memory.md 효율 로그 이벤트

| 이벤트 | 기록 대상 | 트리거 |
|--------|----------|--------|
| 도구 조합 성공 | 선택 기록 테이블 | 매 작업 완료 시 |
| 도구 조합 실패 | 에러 패턴 DB (loop.md) | 루프 발동 시 |
| MCP 서버 사용 | TOOL_ADOPTION_LOG | --seq 활성화 시 |

## 업데이트 규칙

- 매 도구 사용 후: 선택 기록에 추가
- 같은 조합 3회 연속 성공 → "학습된 패턴"에 승격
