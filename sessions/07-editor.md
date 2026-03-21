에디터 페이지 기능을 보강해줘.

## 작업 내용

src/app/(dashboard)/projects/[id]/editor/ 관련 파일들:

1. 섹션 드래그 정렬 구현 (drag & drop으로 섹션 순서 변경)
2. 실시간 미리보기 개선 (편집 시 즉시 프리뷰 반영)
3. edit-panel ↔ preview-panel 양방향 연동 강화
4. editor-store.ts 상태 관리 개선

## 규칙
- CLAUDE.md의 코딩 규칙 준수
- 새 npm 패키지 추가 금지 (기존 패키지로 구현)
- "use client" 필요 시 명시
- Tailwind CSS 사용, inline style 금지

## 완료 조건
- npx tsc --noEmit 통과
- 에디터 페이지 정상 렌더링
- 드래그 정렬 동작 확인

완료 후 git add . && git commit -m "feat(editor): enhance drag sort and live preview"
