# 반복 메커니즘 — Code Engine Agent

## 루프 발동 조건

### 자동 발동 — [FAIL_TRIGGER] 블록 수신

> checklist.md 또는 reviewer.md에서 [FAIL_TRIGGER] 블록을 수신하면 자동 발동

```yaml
# checklist.md에서 수신
[FAIL_TRIGGER]
type: CHECKLIST_FAIL
engine: ⑩ Code Engine
failed_items: [...]
engine_specific_failures: [...]

# reviewer.md에서 수신
[FAIL_TRIGGER]
type: REVIEW_FAIL
engine: ⑩ Code Engine
failed_perspectives: [...]
failed_engine_specific: [...]
fix_guidance: [...]
```

### [FAIL_TRIGGER] 파싱 로직

```
[FAIL_TRIGGER] 수신
    │
    ├── type: CHECKLIST_FAIL
    │   ├── engine_specific_failures 확인
    │   │   ├── html_valid=false → HTML 유효성 루프
    │   │   ├── xss_escaped=false → XSS 취약점 루프
    │   │   ├── style_mapping_valid=false → 스타일 매핑 루프
    │   │   ├── responsive_valid=false → 반응형 디자인 루프
    │   │   ├── section_wrapper_valid=false → 섹션 래퍼 속성 루프
    │   │   ├── patternId_mapped=false → 렌더러 매핑 루프
    │   │   └── deterministic_verified=false → 부수효과 제거 루프
    │   └── 일반 실패 → 표준 루프
    │
    └── type: REVIEW_FAIL
        ├── failed_perspectives → 관점별 수정
        ├── failed_engine_specific
        │   ├── html_validity → HTML 구조 수정
        │   ├── xss_security → esc() 전수 검증 + 적용
        │   ├── style_mapping_accuracy → 인라인 스타일/렌더러 수정
        │   ├── responsive_quality → 미디어 쿼리 보강
        │   └── determinism → 부수효과 제거
        └── fix_guidance → 수정 가이드 적용
```

### 기존 자동 발동 조건 (호환)
- `npx tsc --noEmit` 에러 > 0
- `npm run lint` 에러 > 0
- `npm run build` 실패
- HTML 유효성 실패 (닫히지 않은 태그, 빈 fullHtml)
- XSS 취약점 감지 (esc() 미적용)
- checklist.md 통과율 < 80%

### 수동 발동
- 사용자 `--loop` 플래그 지정
- 사용자 "다시", "개선", "수정" 등 반복 요청

## 루프 프로세스

```
FAIL 판정 또는 에러 발생
    │
    ▼
[이터레이션 N/3]

1단계 문제 식별
   ├── 에러 메시지 수집 (tsc, lint, build 출력)
   ├── 검수 피드백 수집 (reviewer.md 결과)
   ├── 에러 패턴 DB 조회 (빠른 해결 경로 있는지?)
   └── 실패 항목 목록 작성
    │
    ▼
2단계 원인 분석
   ├── 빠른 해결 경로 있음 → 즉시 해결 방법 적용
   ├── 단순 에러 → 에러 메시지에서 직접 파악
   ├── 복잡 에러 → Sequential MCP (--seq) 활용
   └── 패턴 에러 → memory.md 이전 실수 참조
    │
    ▼
3단계 수정 실행
   ├── Edit/Write로 코드 수정
   ├── 변경 내용 기록
   └── 수정 근거 기록
    │
    ▼
4단계 검증
   ├── checklist.md 재실행
   │   ├── npx tsc --noEmit
   │   ├── npm run lint
   │   └── npm run build
   └── 전부 통과?
       ├── YES → 5단계로
       └── NO → 남은 에러로 다시 1단계
    │
    ▼
5단계 재검수
   └── reviewer.md 판정
       ├── PASS → 루프 탈출
       ├── WARN → 루프 탈출 (개선 사항 기록)
       └── FAIL → 다음 이터레이션
```

## 탈출 조건

### 성공 탈출
- reviewer.md PASS 또는 WARN 판정
- checklist.md 전 항목 통과

### 강제 탈출
- **최대 반복 3회** 도달 → 에스컬레이션

### 에스컬레이션 보고 포맷
```
루프 3회 반복 후에도 미해결

문제: [에러 내용]
시도한 수정:
  - 이터레이션 1: [수정 내용] → [결과]
  - 이터레이션 2: [수정 내용] → [결과]
  - 이터레이션 3: [수정 내용] → [결과]

남은 에러: [현재 상태]
제안: [가능한 해결 방향]
```

## 엔진 특화 루프

### HTML 검증 실패 루프
```
HTML 유효성 에러 감지 (닫히지 않은 태그, 빈 HTML)
    │
    ▼
1. renderers.ts 확인 — 해당 patternId 렌더러 함수 확인
    │
    ▼
2. 렌더러 패턴 수정
   ├── 닫히지 않은 태그 → 태그 닫기 추가
   ├── 빈 HTML → 입력 데이터 전달 확인, fallback 로직 추가
   ├── 중첩 태그 오류 → 태그 순서 수정
   └── 자기 닫기 태그 형식 → <img/>, <br/>, <hr/> 형식 통일
    │
    ▼
3. renderers.ts 수정 적용
    │
    ▼
4. 재빌드 (runCodeEngine 재실행 또는 tsc + build)
    │
    ▼
5. HTML 유효성 재검증
   ├── 성공 → 루프 탈출
   └── 실패 → 다음 이터레이션 (다른 패턴 확인)
```

### XSS 취약점 발견 루프
```
esc() 미적용 사용자 데이터 감지
    │
    ▼
1. Grep("esc(") — esc() 사용처 전수 검색
    │
    ▼
2. 사용자 데이터 삽입 지점 목록화
   ├── productName
   ├── headline, subheadline, body
   ├── bulletPoints[]
   ├── ctaText, microCopy
   └── imageDirection
    │
    ▼
3. esc() 래핑 추가
   ├── `${data}` → `${esc(data)}`
   ├── 배열 요소: `.map(item => esc(item))`
   └── URL 속성: 프로토콜 검증 로직 추가
    │
    ▼
4. 재검증 (Grep으로 누락 재확인)
    │
    ▼
5. 성공? → 루프 탈출
   실패? → 다음 이터레이션
```

### 스타일 매핑 실패 루프
```
인라인 스타일 미적용 감지
    │
    ▼
1. StyleConfig.tokens 확인 — DesignTokens 구조 (colors, fontFamily)
    │
    ▼
2. buildGlobalCss 로직 확인 — 폰트 패밀리/리셋/반응형 CSS
    │
    ▼
3. 렌더러에서 tokens.colors 직접 참조 확인
    │
    ▼
4. 하드코딩된 색상/폰트 없는지 확인
    │
    ▼
5. 재검증
```

## 에러 패턴 DB (자동 누적)

| 에러 유형 | 발생 횟수 | 해결 방법 | 평균 해결 시간 | 마지막 발생 |
|----------|----------|----------|--------------|------------|
| - | - | - | - | - |

## 빠른 해결 경로 (패턴 DB에서 자동 생성)

> 같은 에러 3회 이상 발생 시 자동 등록

| 에러 패턴 | 빠른 해결 | 성공률 |
|----------|----------|--------|
| - | - | - |

## 루프 효율 메트릭 (자동 갱신)

- 총 루프 횟수: 0
- 평균 이터레이션 수: -
- 1회 해결률: -
- 에러 감소율: -

## 학습 누적 규칙

매 이터레이션 종료 시:
```markdown
### 루프 기록 [날짜]
- **에러**: [에러 설명]
- **원인**: [근본 원인]
- **해결**: [수정 내용]
- **교훈**: [재발 방지 학습]
```

→ memory.md에도 동기화

## [LOOP_SYNC] 출력 블록

> 루프 성공 시 자동 생성 → memory.md가 수신

```yaml
[LOOP_SYNC]
engine: ⑩ Code Engine
timestamp: {ISO8601}
trigger_source: CHECKLIST_FAIL | REVIEW_FAIL
iterations: {N}
error_summary:
  type: {에러 유형}
  root_cause: {근본 원인}
  fix_applied: {적용한 수정}
  lesson: {교훈}
result: RESOLVED
```

## [ESCALATION_RECORD] 출력 블록

> 루프 3회 실패 시 자동 생성 → memory.md가 수신

```yaml
[ESCALATION_RECORD]
engine: ⑩ Code Engine
timestamp: {ISO8601}
trigger_source: CHECKLIST_FAIL | REVIEW_FAIL
iterations_exhausted: 3
error_summary:
  type: {에러 유형}
  root_cause: {추정 원인}
  attempted_fixes:
    - iteration_1: {시도 1}
    - iteration_2: {시도 2}
    - iteration_3: {시도 3}
  unresolved_reason: {미해결 사유}
escalation_target: 사용자
recommended_action: {권장 조치}
blocker_registered: true
```

## 업데이트 규칙

- 매 이터레이션 종료 시: 에러 패턴 DB 갱신
- 같은 에러 3회 발생 → "빠른 해결 경로"에 자동 등록
- 새로운 에러 유형 → 에러 패턴 DB에 신규 항목
- 루프 효율 메트릭 → 매 루프 완료 시 재계산
- 루프 성공 → [LOOP_SYNC] 생성 → memory.md 전달
- 루프 실패 (3회) → [ESCALATION_RECORD] 생성 → memory.md 전달

## 반성 기준

- 3회 루프 후에도 미해결 → 접근법 자체를 재검토
- 같은 에러 재발 → memory.md 참조 실패 여부 확인
- 에러 증가 → 수정이 새 에러를 만드는지 확인
- 매 이터레이션 에러 감소율 < 30% → 접근법 변경 필요
