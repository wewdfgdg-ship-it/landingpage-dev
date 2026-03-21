최종 QA 및 배포 점검을 해줘.

## 작업 내용

1. 전체 빌드 확인
   - npx tsc --noEmit
   - npm run build
   - npm run lint

2. 환경변수 체크
   - .env.example 또는 코드에서 사용하는 환경변수 목록 확인
   - 누락된 환경변수가 있으면 보고

3. Vercel 배포 설정 검증
   - vercel.json 확인
   - next.config.ts 확인
   - 빌드 출력 사이즈 확인

4. 보안 체크
   - 하드코딩된 시크릿 없는지 확인
   - API 라우트 인증 체크

## 완료 조건
- npm run build 성공
- npm run lint 경고 0개
- npx tsc --noEmit 에러 0개
- 보안 이슈 0개

완료 후 git add . && git commit -m "chore: final QA pass"
