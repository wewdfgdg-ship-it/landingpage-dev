# 출력 표준

> 100% 공용 — 12 에이전트 동일. 모든 출력은 이 포맷을 따른다.

## 상태 보고

### 작업 시작
```
🔄 [에이전트#] [작업명] 시작 — 1줄 설명
```

### 작업 완료
```
✅ [에이전트#] [작업명] 완료 — 결과 요약
```

### 에러 발생
```
❌ [에이전트#] [에러 타입] — 원인 — 수정 계획
```

### 경고
```
⚠️ [에이전트#] [경고 타입] — 내용 — 권장 조치
```

## 진행률 표시

개별 작업:
```
■■■□□ 3/5 (60%) — 현재 단계 설명
```

파이프라인 전체:
```
■□□□□□□□□□□□ 1/12 — ① 제품 분석
■■■□□□□□□□□□ 3/12 — ③ 전환 전략
■■■■■■■■■■□□ 10/12 — ⑩ 코드 생성
■■■■■■■■■■■■ 12/12 — 완료
```

## 코드 변경 보고

단일 파일:
```
📝 src/engine/05-psychological-copy/index.ts:45
   변경: quality-gate 점수 계산 로직 수정 (frame 60% + tone 40%)
```

다중 파일:
```
📝 변경 파일 3개:
  - src/engine/05-psychological-copy/index.ts:45 — QG 로직 수정
  - src/engine/05-psychological-copy/types.ts:12 — CopyBlock 타입 확장
  - src/engine/pipeline.ts:142 — retry 콜백 추가
```

## 검수 결과 보고

```
🔍 검수 결과: PASS ✅

  타입 체크:    ✅ 에러 0
  ESLint:      ✅ 에러 0, 경고 2
  빌드:        ✅ 성공 (12.3s)
  코드 리뷰:   ✅ 정확성/성능/보안/유지보수 통과
```

```
🔍 검수 결과: FAIL ❌

  타입 체크:    ❌ 에러 3 (TS2345, TS2339, TS7006)
  ESLint:      ✅ 에러 0
  빌드:        ❌ 실패 (타입 에러)
  → loop.md 발동: 이터레이션 1/3
```

## 비용 보고

AI 호출 시:
```
💰 AI 비용: ₩30 (Claude Sonnet, 입력 1.2K + 출력 0.8K 토큰)
💰 AI 비용: ₩110 (Gemini Flash, 이미지 1장)
```

파이프라인 전체:
```
💰 총 비용: ₩1,600
  - Claude ×5: ₩250
  - Gemini ×8: ₩1,350
```

## 의사결정 보고

```
🎯 결정: [무엇을 결정했는지]
   근거: [왜 이렇게 결정했는지]
   대안: [고려했지만 선택하지 않은 것]
```

## 심볼 시스템

| 심볼 | 의미 |
|------|------|
| ✅ | 완료, 통과 |
| ❌ | 실패, 에러 |
| ⚠️ | 경고, 주의 |
| 🔄 | 진행 중 |
| ⏳ | 대기 중 |
| 🚨 | 긴급, 크리티컬 |
| 📝 | 코드 변경 |
| 🔍 | 검수, 분석 |
| 💰 | 비용 |
| 💡 | 인사이트, 학습 |
| 🎯 | 목표, 타겟, 결정 |

## 로그 레벨

| 레벨 | 용도 | 표시 |
|------|------|------|
| INFO | 일반 진행 상황 | 기본 출력 |
| WARN | 잠재적 문제, 권장 수정 | ⚠️ |
| ERROR | 실행 실패, 수정 필요 | ❌ |
| CRITICAL | 즉시 중단 필요 | 🚨 |

## 에이전트 간 핸드오프 포맷

### 성공 핸드오프
```
---
[ENGINE_OUTPUT]
engine: ①
agent: Product Intelligence Agent
status: SUCCESS
output_type: ProductBrief
quality_score: 85
warnings: []
cost: ₩65
duration: 12s
next_engines: [②, ③, ⑤]
---
```

### 에러 전파
```
---
[ENGINE_ERROR]
engine: ①
agent: Product Intelligence Agent
error_type: AI_CALL_FAILURE
retry_count: 2/2
impact: [②, ③, ④, ⑤, ⑥, ⑦, ⑧, ⑨, ⑩, ⑪]
escalation: REQUIRED
message: Claude API 타임아웃 3회 연속
---
```

### 품질 경고
```
---
[ENGINE_WARNING]
engine: ⑤
agent: Psychological Copy Agent
warning_type: QUALITY_GATE_MARGINAL
quality_score: 81 (기준: 80)
message: 품질 게이트 간신히 통과, CTA 섹션 개선 권장
---
```

## 업데이트 규칙
- 새로운 출력 유형 발생 시 포맷 추가
- 비용 단위는 항상 ₩ (한국 원화)
