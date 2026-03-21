E2E 테스트 기초를 작성해줘.

## 작업 내용

playwright.config.ts는 이미 존재함. 테스트 파일만 작성:

1. e2e/auth.spec.ts — 로그인/로그아웃 플로우
2. e2e/project-crud.spec.ts — 프로젝트 생성/조회/삭제
3. e2e/editor.spec.ts — 에디터 진입, 섹션 편집 기본 플로우
4. e2e/settings.spec.ts — 설정 페이지 접근, 프로필 수정

## 규칙
- CLAUDE.md의 코딩 규칙 준수
- 기존 playwright.config.ts 설정 사용
- 새 npm 패키지 추가 금지
- 테스트는 독립적으로 실행 가능해야 함
- data-testid 속성 활용

## 완료 조건
- npx tsc --noEmit 통과
- playwright test --list로 테스트 목록 확인

완료 후 git add . && git commit -m "test(e2e): add core flow tests"
