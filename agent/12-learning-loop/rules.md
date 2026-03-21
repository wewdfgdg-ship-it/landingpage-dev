# 규칙 — Learning Loop Agent

## CLAUDE.md 상속 규칙

### 수정 가능 경로
- `src/` — 모든 소스코드
- `prisma/` — DB 스키마
- `public/` — 정적 파일
- `scripts/` — Worker 스크립트
- `docs/` — 개발 문서
- `agent/` — 에이전트 문서

### 수정 금지 경로
- `.env`, `.env.local` — 환경변수
- `next.config.ts` — 논의 후 수정
- `package.json` — 논의 후 수정
- `tsconfig.json` — 논의 후 수정
- `.github/` — CI/CD

### Import 규칙
```
@/*           → src/* (절대경로 필수)
@/lib/db      → Prisma client
@/lib/auth    → NextAuth
@/lib/redis   → Upstash Redis
@/lib/ai/claude → Claude AI
@/lib/ai/gemini → Gemini AI
@/lib/utils   → 유틸리티
@/engine/XX-name → 엔진 모듈
```

## 에이전트 전용 규칙

### 필수
- 파일 수정 전 반드시 Read tool로 현재 내용 확인
- TypeScript strict mode — 모든 함수에 명시적 반환 타입
- 서버 컴포넌트 기본, 클라이언트는 `"use client"` 명시
- Tailwind CSS 사용, inline style 금지
- 한국어 UI 텍스트 (영어 금지)

### 금지
- `any` 타입 사용 금지
- `console.log` 금지 (개발 중 임시 제외)
- `window`, `document` 직접 접근 금지 (SSR 호환)
- 새 npm 패키지 추가 금지 (사용자 논의 후 결정)
- 하드코딩된 API 키/시크릿 금지
- 자동 커밋/push 금지 (사용자 승인 필수)

### 엔진 구조 규칙
```
src/engine/XX-name/
├── index.ts    — 실행 (runXxx 함수 export)
├── types.ts    — 타입 정의
├── rules.ts    — 규칙 (선택)
└── prompts.ts  — AI 프롬프트 (선택, AI 엔진만)
```
- 엔진 간 데이터 전달: types.ts의 타입으로만
- 파이프라인 연결: `src/engine/pipeline.ts`에서 순차 실행

### 안전 규칙
- 되돌릴 수 없는 작업 전 사용자 확인:
  - git reset --hard, git push --force
  - 파일/브랜치 삭제
  - DB 마이그레이션 (prisma db push)
  - 배포 (vercel deploy)
- 대규모 변경(10+ 파일) 시 단계별 실행, 중간 검증

### 비용 규칙
- AI 호출 시 예상 비용 기록 (₩ 단위)
- 불필요한 AI 호출 최소화
- Gemini 이미지: 768px 리사이즈, JPEG, File API 활용
- Claude: JSON prefill, 캐싱 활용

## 엔진 특화 규칙

### Level 3 처방 사용자 승인 게이트 필수
- Level 1 (미세 조정): 자동 적용 가능 (예: CTA 텍스트 변경)
- Level 2 (섹션 변경): 자동 적용 가능 (예: 섹션 순서 변경)
- **Level 3 (구조 변경): 사용자 승인 필수** (예: 섹션 추가/삭제, 전략 변경)
- Level 3 처방 생성 시 `requiresApproval: true` 필수 설정
- 승인 없이 Level 3 적용 절대 금지

### A/B 테스트 교란 변수 통제
- 동시에 같은 섹션에 2개 이상 A/B 테스트 금지
- 테스트 시작 전 기존 진행 중 테스트 확인
- 외부 요인(시즌, 캠페인 등) 기록
- 트래픽 분배 50:50 유지 (랜덤 배정)

### 통계적 유의성 검증 (p < 0.05)
- A/B 테스트 결론 도출 시 반드시 p-value 계산
- p < 0.05만 "유의미한 결과"로 인정
- 샘플 크기 부족 시 "inconclusive" 반환 (조기 결론 금지)
- 최소 샘플 크기: 각 variant에 500+ (권장 1000+)

### 진단 임계값 규칙
- bounceRate > 70% → 'high_bounce' 진단
- scrollDepth.p50 < 30% → 'low_scroll' 진단
- CTA 클릭률 < 2% → 'weak_cta' 진단
- 특정 섹션 dwellTime < 2초 → 'slow_section' 진단
- 전환율 < 1% → 'drop_off' 진단
- 임계값은 memory.md의 패턴에 따라 조정 가능 (사용자 승인 필요)

### AI 프롬프트 규칙
- 시스템 프롬프트는 반드시 **한국어**로 작성
- Claude 호출 시 **JSON prefill 필수** (assistant 메시지에 `{` 포함)
- 재시도 로직 (max 2, 지수 백오프)
- 비용 추적: 입력/출력 토큰 수 기록 + 비용 계산

## 위반 대응 프로토콜

```
규칙 위반 감지 (lint/tsc/review)
    │
    ├── 자동 수정 가능 (import 경로, 타입 누락, 린트 에러)
    │   → 즉시 수정 + memory.md에 기록
    │
    ├── 판단 필요 (설계 변경, 구조 변경)
    │   → 사용자에게 에스컬레이션
    │
    └── 모든 위반 기록
        → memory.md 실수 섹션에 누적
        → 같은 위반 3회+ → rules.md에 명시적 규칙 추가 검토
```

### 자동 수정 가능한 위반
| 위반 | 자동 수정 |
|------|----------|
| import 상대경로 | `@/` 절대경로로 변환 |
| 반환 타입 누락 | 타입 추론 후 명시 |
| console.log 남김 | 삭제 |
| lint 에러 (formatting) | 자동 수정 |
| Level 3 requiresApproval 누락 | true로 설정 |

### 사용자 판단 필요한 위반
| 위반 | 행동 |
|------|------|
| any 타입이 불가피 | 사용자에게 근거 설명 + 승인 요청 |
| 새 패키지 필요 | 대안 탐색 → 불가피 시 사용자 승인 |
| 엔진 구조 변경 | 설계 논의 요청 |
| 진단 임계값 변경 | 사용자 승인 후 변경 |

## 위반 → loop.md 연결 테이블

| 위반 유형 | 심각도 | loop.md 루프 | 자동 수정 |
|----------|--------|-------------|----------|
| DiagnosisType 유효하지 않은 값 | CRITICAL | 진단 정확도 미달 루프 | enum 값으로 교정 |
| severity 유효하지 않은 값 | CRITICAL | 진단 정확도 미달 루프 | 4단계로 교정 |
| prescription level 범위 초과 | CRITICAL | 처방 레벨 검증 루프 | 1-3 범위로 클램프 |
| Level 3 requiresApproval 누락 | CRITICAL | Level 3 승인 게이트 수정 | true로 강제 설정 |
| 동일 섹션 동시 A/B 테스트 | HIGH | A/B 테스트 교란 변수 루프 | 기존 테스트 확인 로직 추가 |
| p-value 계산 오류 | HIGH | A/B 테스트 교란 변수 루프 | 통계 로직 재검증 |
| 샘플 크기 부족으로 조기 결론 | HIGH | A/B 테스트 교란 변수 루프 | inconclusive 반환으로 수정 |
| AI JSON 파싱 실패 | HIGH | AI 응답 파싱 실패 루프 | 프롬프트 + prefill 수정 |
| 시스템 프롬프트 영어 작성 | MEDIUM | AI 응답 파싱 실패 루프 | 한국어로 변환 |
| JSON prefill 미사용 | MEDIUM | AI 응답 파싱 실패 루프 | `{` prefill 추가 |
| 비용 ₩500 초과 | MEDIUM | 비용 추적 로직 추가 | 규칙 우선 호출 강화 |
| 비용 추적 누락 | MEDIUM | 비용 추적 로직 추가 | usage 기록 추가 |
| tsc/lint/build 에러 | MEDIUM | 일반 빌드 에러 루프 | 에러 메시지 기반 수정 |

## 업데이트 규칙

- 새 규칙 추가: 사용자 지시 또는 반복 에러 패턴(3회+) 발생 시
- 규칙 삭제: 사용자 명시적 지시 시만
- 엔진 특화 규칙: 해당 엔진 작업 중 발견된 패턴에서 추가
- 위반 발생 시: loop.md 연결 테이블에 따라 루프 발동
- reviewer.md 피드백에서 새 위반 유형 발견 시: 테이블에 추가
