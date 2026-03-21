# 도구 선택 — Layout Intelligence Agent

## 엔진 특화 도구 조합

### 주요 작업 시퀀스: Layout Intelligence 엔진 구현

```
1. Read(src/engine/08-layout-intelligence/types.ts) → 타입 확인
   │
2. Grep("renderers" --type ts) → 패턴 목록 확인
   │
3. Write(src/engine/08-layout-intelligence/rules.ts) → 패턴 매핑 규칙
   │
4. Write(src/engine/08-layout-intelligence/index.ts)
   → runLayoutIntelligence 함수 (패턴 매핑 + diversity + mobileReady)
   │
5. Bash("npx tsc --noEmit") → 타입 체크
   │
6. Bash("npm run build") → 빌드 검증
```

## 작업 유형별 자동 매핑

| 작업 | 1차 도구 | 2차 도구 | MCP |
|------|----------|----------|-----|
| 엔진 구현 | Write/Edit | Bash(tsc) | --magic (패턴 참조) |
| 패턴 검증 | Grep(renderers) → Read | Edit | - |
| 타입 호환 검증 | Grep → Read | Edit | - |
| 버그 수정 | Grep → Read → Edit | Bash(tsc) | - |

## Fallback 체인

| 1차 시도 | 실패 시 | 최종 대안 |
|----------|---------|----------|
| Magic (패턴 참조) | Context7 (Tailwind) | 직접 구현 |
| 직접 구현 | 사용자에게 질문 | - |

## 선택 기록 (자동 누적)

| 날짜 | 작업 유형 | 선택한 조합 | 결과 | 소요 시간 |
|------|----------|------------|------|----------|
| - | - | - | - | - |

## 통합 참조: mcp-registry.md 매핑

| 작업 유형 | MCP 서버 | 활성화 조건 |
|----------|---------|-----------|
| 레이아웃 패턴 참조 | Magic (--magic) | 패턴 디자인 참조 필요 시 |
| 복잡한 디버깅 | Sequential (--seq) | FAIL 판정 후 디버깅 시 |
| CSS/Tailwind 패턴 | Context7 (--c7) | Tailwind 레이아웃 패턴 참조 시 |

## 통합 참조: skill-registry.md 조합

| 작업 유형 | 스킬 조합 | 비고 |
|----------|----------|------|
| 패턴 매핑 구현 | Grep(renderers) → Write → Bash(tsc) | 패턴 ID 수집 후 매핑 |
| 다양성 검증 | Read → Edit → Bash(tsc) | diversityScore 계산 검증 |
| 파이프라인 연결 | Grep → Read → Edit | pipeline.ts 수정 |

## 통합 참조: memory.md 효율 로그 이벤트

| 이벤트 | 기록 대상 | 트리거 |
|--------|----------|--------|
| 도구 조합 성공 | 선택 기록 테이블 | 매 작업 완료 시 |
| 도구 조합 실패 | 에러 패턴 DB (loop.md) | 루프 발동 시 |
| MCP 서버 사용 | TOOL_ADOPTION_LOG | --magic/--seq 활성화 시 |

## 업데이트 규칙

- 매 도구 사용 후: 선택 기록에 추가
- 같은 조합 3회 연속 성공 → "학습된 패턴"에 승격
