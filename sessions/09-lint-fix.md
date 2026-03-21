린트 경고를 정리하고 타입 안전성을 개선해줘.

## 작업 내용

1. `npm run lint` 실행하여 전체 경고 목록 확인
2. 모든 lint warning 수정
3. `!` (non-null assertion) → 안전한 패턴으로 교체
   - optional chaining (?.)
   - nullish coalescing (??)
   - early return guard
4. 빌드 최종 검증

## 규칙
- CLAUDE.md의 코딩 규칙 준수
- any 타입 → 구체적 타입으로 교체
- 기능 변경 없이 타입/린트만 수정 (surgical changes)
- 기존 동작에 영향 없도록 주의

## 완료 조건
- npm run lint → 경고 0개
- npx tsc --noEmit → 에러 0개
- npm run build → 성공

완료 후 git add . && git commit -m "fix: resolve all lint warnings and improve type safety"
