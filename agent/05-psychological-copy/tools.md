# 사용 가능 도구

> 100% 공용 — 12 에이전트 동일. 도구 추가/제거 시 이 파일 갱신.

## Claude Code 네이티브 도구

| 도구 | 용도 | 비용 |
|------|------|------|
| Read | 파일 읽기 (수정 전 필수) | 무료 |
| Write | 새 파일 생성 또는 전체 재작성 | 무료 |
| Edit | 파일 부분 수정 (old_string → new_string) | 무료 |
| Glob | 파일 패턴 검색 (`**/*.ts`) | 무료 |
| Grep | 코드 내용 검색 (정규식) | 무료 |
| Bash | 셸 명령 실행 | 무료 |
| Agent | 서브에이전트 위임 (Explore, Plan, general-purpose) | 무료 |
| TodoWrite | 작업 목록 관리 | 무료 |
| WebSearch | 웹 검색 | 무료 |
| WebFetch | URL 내용 가져오기 | 무료 |

## MCP 서버 (상세: 각 에이전트 mcp-registry.md)

| 서버 | 용도 | 활성화 | 비용 |
|------|------|--------|------|
| Context7 | 라이브러리 문서, 프레임워크 패턴 | `--c7` | 토큰 |
| Sequential | 복잡한 분석, 다단계 추론 | `--seq` | 토큰 |
| Magic | UI 컴포넌트 생성, 디자인 시스템 | `--magic` | 토큰 |
| Playwright | E2E 테스트, 브라우저 자동화 | `--play` | 토큰 |

## 스킬 (상세: 각 에이전트 skill-registry.md)

| 스킬 | 용도 |
|------|------|
| /build | 프로젝트 빌드 + 프레임워크 감지 |
| /implement | 기능 구현 (엔진/API/컴포넌트) |
| /analyze | 코드 분석 (품질/보안/성능/아키텍처) |
| /improve | 코드 개선 (리팩토링/최적화) |
| /test | 테스트 실행/생성 |
| /cleanup | 데드코드 정리, 기술부채 감소 |
| /design | 시스템/API/컴포넌트 설계 |
| /troubleshoot | 문제 진단, 디버깅 |
| /explain | 코드/개념 설명 |
| /git | Git 워크플로우 (커밋/PR/브랜치) |
| /document | 문서 생성 |

## 프로젝트 CLI

### 검증
```bash
npx tsc --noEmit          # 타입 체크
npm run lint              # ESLint
npm run build             # 프로덕션 빌드
```

### 개발
```bash
npm run dev               # 개발 서버 (localhost:3000)
npm run worker            # BullMQ Worker 실행
```

### 데이터베이스
```bash
npx prisma db push        # 스키마 → DB 반영
npx prisma generate       # Prisma Client 재생성
```

### 테스트
```bash
npm run test:e2e          # Playwright E2E 테스트
```

## 외부 도구 검색

### MCP 검색
```
WebSearch("Claude Code MCP server [키워드]")
search_skills("MCP [키워드]")
```

### 스킬 검색
```
search_skills("[작업 유형]")    # prompts.chat
get_skill(id)                  # 상세 조회 + 다운로드
```

## 도구 성능 로그 (자동 갱신)

> 각 에이전트의 memory.md에 개별 추적. 여기는 전체 기준.

| 도구 | 사용 횟수 | 성공률 | 평균 시간 | 마지막 사용 |
|------|----------|--------|----------|------------|
| - | 0 | - | - | - |

### 업데이트 규칙
- 매 도구 사용 후: 해당 에이전트 memory.md의 도구 효율 로그에 기록
- 이 파일은 새 도구 추가/제거 시에만 갱신
