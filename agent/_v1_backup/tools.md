# 사용 가능 도구

## Claude Code 네이티브 도구

| 도구 | 용도 |
|------|------|
| Read | 파일 읽기 (수정 전 필수) |
| Write | 새 파일 생성 또는 전체 재작성 |
| Edit | 파일 부분 수정 (old_string → new_string) |
| Glob | 파일 패턴 검색 (예: `**/*.ts`) |
| Grep | 코드 내용 검색 (정규식 지원) |
| Bash | 셸 명령 실행 |
| Agent | 서브에이전트 위임 (Explore, Plan, general-purpose) |
| TodoWrite | 작업 목록 관리 |
| WebSearch | 웹 검색 |
| WebFetch | URL 내용 가져오기 |

## MCP 서버 (상세: @mcp-registry.md)

| 서버 | 용도 | 활성화 |
|------|------|--------|
| Context7 | 라이브러리 문서, 프레임워크 패턴 | `--c7` |
| Sequential | 복잡한 분석, 다단계 추론 | `--seq` |
| Magic | UI 컴포넌트 생성, 디자인 시스템 | `--magic` |
| Playwright | E2E 테스트, 브라우저 자동화 | `--play` |

## 스킬 (상세: @skill-registry.md)

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

## 프로젝트 CLI 명령어

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

## 외부 스킬 검색

필요 시 prompts.chat에서 외부 스킬 탐색:
- `search_skills(query)` — 키워드로 스킬 검색
- `get_skill(id)` — 스킬 상세 조회 + 다운로드
