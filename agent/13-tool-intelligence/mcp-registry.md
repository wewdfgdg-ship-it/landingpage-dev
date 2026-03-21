# MCP 레지스트리 — Tool Intelligence Agent

> 4개 MCP 서버의 상세 프로파일, 비용 규칙, 활성화 패턴, 효율 추적.
> Tool Intelligence의 **비용 관리 중추**.

---

## Tool Intelligence 전용 MCP 우선순위

| 순위 | MCP | 사용 빈도 | 용도 |
|------|-----|----------|------|
| 1 | Context7 | 낮음 | 발견 도구의 공식 문서 확인 |
| 2 | Sequential | 낮음 | 복잡한 적합성/품질 분석 |
| 3 | Magic | **사용 안 함** | UI 생성 없음 |
| 4 | Playwright | **사용 안 함** | 브라우저 사용 없음 |

---

## MCP 상세 프로파일

### Context7

```yaml
용도: 외부 라이브러리 공식 문서 조회
활성화 플래그: --c7, --context7

워크플로우:
  1. resolve-library-id → 라이브러리 ID 확인
  2. get-library-docs → 문서 조회 (topic 지정)
  3. 패턴 추출 → 구현 적용
  4. 즉시 OFF

주요 라이브러리:
  - @anthropic-ai/sdk (Claude API)
  - Next.js 16 (프레임워크)
  - Prisma 7 (ORM)
  - Tailwind CSS v4 (스타일)
  - @aws-sdk/client-s3 (R2 스토리지)

비용:
  - 켜져있는 동안 ~300토큰/턴
  - 평균 사용: 2-3턴 = ~600-900토큰

에러 복구:
  - 라이브러리 못 찾음 → WebSearch 대체
  - 타임아웃 → 캐시된 지식 사용 + 한계 명시
  - 서버 불가 → WebSearch 대체

Tool Intelligence 사용 시점:
  - 발견 도구의 공식 문서 품질 확인 시에만
  - 사용 후 즉시 OFF
```

### Sequential

```yaml
용도: 복잡한 다단계 분석/추론
활성화 플래그: --seq, --sequential

사고 깊이:
  --think:      ~4K 토큰 (단일 도구 적합성 분석)
  --think-hard: ~10K 토큰 (도구 체인 설계, 시스템 분석)
  --ultrathink: ~32K 토큰 (전체 도구 생태계 재설계)

비용:
  - 켜져있는 동안 ~500토큰/턴
  - --think 사용 시 추가 ~4K
  - --think-hard 사용 시 추가 ~10K

에러 복구:
  - 타임아웃 → 직접 추론 대체
  - 분석 불완전 → 부분 결과 + 경고

Tool Intelligence 사용 시점:
  - 4단계 필터 중 복잡한 적합성 판단 시에만
  - 사용 후 즉시 OFF
```

### Magic

```yaml
용도: UI 컴포넌트 생성, 디자인 시스템 통합
활성화 플래그: --magic

비용: ~400토큰/턴

Tool Intelligence 사용: 금지
이유: Tool Intelligence는 UI를 생성하지 않음

추천 대상 에이전트:
  - ⑧ Layout Intelligence (패턴 참조)
  - ⑨ Visual Style (디자인 토큰 참조)
  - ⑩ Code Engine (렌더러 HTML 참조)
```

### Playwright

```yaml
용도: 크로스 브라우저 E2E 테스트, 자동화
활성화 플래그: --play, --playwright

비용: ~400토큰/턴

Tool Intelligence 사용: 금지
이유: Tool Intelligence는 브라우저를 사용하지 않음

추천 대상 에이전트:
  - ⑩ Code Engine (시각적 검증)
  - ⑫ Learning Loop (A/B 테스트 검증)
```

---

## MCP 비용 규칙 요약

> 상세: @../_shared/mcp-cost-rules.md

### 핵심 원칙
- **기본 = 전체 OFF**
- 필요 시에만 ON, 완료 즉시 OFF
- **최대 2개 동시 활성화** (허용 조합: Seq+C7, Magic+C7, Seq+Play)
- 3개+ 동시 활성화는 금지 (complexity >0.9 + 사용자 승인 시 예외)

### 비용 산출

```
MCP 4개 전부 ON = ~1,600토큰/턴 (낭비)
목표: <300토큰/턴 평균

Context7 ON (2턴)  = ~600토큰
Sequential ON (1턴) = ~500토큰
Magic ON (3턴)     = ~1,200토큰
Playwright ON (5턴) = ~2,000토큰
```

### 에이전트별 MCP 예산 가이드

| 에이전트 유형 | 권장 MCP | 턴당 예산 |
|-------------|---------|----------|
| AI 엔진 (01, 05) | Seq + C7 | ~800토큰 |
| 하이브리드 (03, 12) | Seq 또는 C7 | ~500토큰 |
| 규칙 엔진 (02, 04, 06, 07) | 거의 불필요 | ~0토큰 |
| UI 관련 (08, 09, 10) | Magic + C7 | ~700토큰 |
| 배포/테스트 (11, 12) | C7 또는 Play | ~400토큰 |

---

## MCP 조합 패턴

### 허용 조합

| 조합 | 용도 | 비용 |
|------|------|------|
| Sequential + Context7 | 프롬프트 설계 + SDK 패턴 | ~800토큰/턴 |
| Magic + Context7 | UI 구현 + 프레임워크 패턴 | ~700토큰/턴 |
| Sequential + Playwright | 테스트 설계 + E2E 실행 | ~900토큰/턴 |
| Context7 단독 | SDK/프레임워크 문서 | ~300토큰/턴 |
| Sequential 단독 | 복잡한 분석/디버깅 | ~500토큰/턴 |

### 금지 조합

| 조합 | 이유 |
|------|------|
| Magic + Playwright | 동시 필요 없음 |
| 3개+ 동시 | 토큰 낭비, 사용자 승인 없이 금지 |
| Tool Intelligence에서 Magic/Playwright | 메타 에이전트 범위 밖 |

---

## MCP 효율 로그 (자동 갱신)

| MCP | 사용 횟수 | 성공률 | 가치 평가 | 마지막 사용 |
|-----|----------|--------|----------|------------|
| Context7 | 0 | - | - | - |
| Sequential | 0 | - | - | - |
| Magic | 0 | - | - | - |
| Playwright | 0 | - | - | - |

### 갱신 규칙
- 사용 후 즉시 갱신
- 성공률 70% 미만 → 대안 검토 트리거
- 5회 사용 후 가치 평가 재산정

---

## 새 MCP 발견 프로토콜

1. 기존 MCP로 해결 불가한 작업 2회+ 발견
2. WebSearch로 새 MCP 후보 탐색
3. 4단계 필터 적용
4. 70점+ → tool-broadcast.md에 게시 (MCP 비용 경고문 필수)
5. memory.md에 기록

### MCP 추천 필수 경고문

```
⚠️ MCP 비용 경고:
이 MCP 서버를 ON하면 매 턴 ~{N}개 도구 × ~300토큰 = ~{총}토큰이 소모됩니다.
필요한 작업에서만 ON하고 완료 후 즉시 OFF하세요.
@_shared/mcp-cost-rules.md 참조
```
