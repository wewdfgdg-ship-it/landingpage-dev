엔진 07~12의 AI 프롬프트를 prompts.ts로 분리해줘.

## 작업 내용

각 엔진 폴더(src/engine/07~ ~ 12~)의 index.ts에서:
1. AI 호출에 사용되는 인라인 프롬프트 문자열을 찾아서
2. 같은 폴더에 `prompts.ts` 파일 생성
3. 프롬프트를 함수 또는 상수로 export
4. index.ts에서 import하도록 수정

## 대상 엔진
- src/engine/07-attention-architecture/
- src/engine/08-layout-intelligence/
- src/engine/09-visual-style/
- src/engine/10-code-engine/
- src/engine/11-deploy/
- src/engine/12-learning-loop/

## 추가
- src/engine/image-generation/ 폴더의 프롬프트도 정리

## 규칙
- AI를 호출하지 않는 엔진은 prompts.ts 생성하지 않아도 됨
- 프롬프트 템플릿에 변수가 있으면 함수로 만들기
- CLAUDE.md의 코딩 규칙 준수

## 완료 조건
- npx tsc --noEmit 통과
- AI 사용 엔진에 prompts.ts 생성 완료
- index.ts에서 정상 import 확인

완료 후 git add . && git commit -m "refactor(engine): extract prompts.ts for engines 07-12"
