# 도구 선택 — Visual Style Agent

## 엔진 특화 도구 조합

### 주요 작업 시퀀스: Visual Style 엔진 구현

```
1. Read(src/engine/09-visual-style/types.ts) → 타입 확인
   │
2. Write(src/engine/09-visual-style/mood-presets.ts)
   → 10종 무드 프리셋 (각각 DesignTokens 포함)
   │
3. Write(src/engine/09-visual-style/rules.ts)
   → industry + brandPersonality → 무드 선택 규칙
   │
4. Write(src/engine/09-visual-style/index.ts)
   → runVisualStyle 함수 (무드 선택 + 토큰 생성 + 검증)
   │
5. Bash("npx tsc --noEmit") → 타입 체크
   │
6. Bash("npm run build") → 빌드 검증
```

### 무드 프리셋 수정 시퀀스

```
1. Read(src/engine/09-visual-style/mood-presets.ts) → 현재 프리셋 확인
   │
2. Edit(mood-presets.ts) → 색상/타이포/스페이싱 수정
   │
3. Bash("npx tsc --noEmit") → 타입 호환 확인
```

## 작업 유형별 자동 매핑

| 작업 | 1차 도구 | 2차 도구 | MCP |
|------|----------|----------|-----|
| 엔진 구현 | Write/Edit | Bash(tsc) | --magic (디자인 참조) |
| 무드 프리셋 수정 | Read → Edit | Bash(tsc) | - |
| 색상 검증 | Read | 직접 검증 | - |
| 타입 호환 검증 | Grep → Read | Edit | - |

## Fallback 체인

| 1차 시도 | 실패 시 | 최종 대안 |
|----------|---------|----------|
| Magic (디자인 참조) | Context7 (Tailwind) | 직접 구현 |

## 선택 기록 (자동 누적)

| 날짜 | 작업 유형 | 선택한 조합 | 결과 | 소요 시간 |
|------|----------|------------|------|----------|
| - | - | - | - | - |

## 통합 참조: mcp-registry.md 매핑

| 작업 유형 | MCP 서버 | 활성화 조건 |
|----------|---------|-----------|
| 디자인 토큰 참조 | Magic (--magic) | 디자인 시스템 참조 시 |
| 복잡한 디버깅 | Sequential (--seq) | FAIL 판정 후 디버깅 시 |
| Tailwind 테마 | Context7 (--c7) | Tailwind 컬러/타이포 참조 시 |

## 통합 참조: skill-registry.md 조합

| 작업 유형 | 스킬 조합 | 비고 |
|----------|----------|------|
| 무드 프리셋 구현 | Write(mood-presets) → Bash(tsc) | 10종 프리셋 정의 |
| 색상 검증 | Read → Edit → Bash(tsc) | hex 유효성 + 대비율 검증 |
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
