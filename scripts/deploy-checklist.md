# 배포 체크리스트

> 최종 점검일: 2026-03-23
> 빌드 결과: Next.js 16.1.6 (Turbopack) — 성공 (exit 0)

---

## 1. 필수 환경변수

### Vercel (Next.js 앱)

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | Yes |
| `AUTH_SECRET` | NextAuth.js 암호화 시크릿 (openssl rand -base64 32) | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 | Yes |
| `ANTHROPIC_API_KEY` | Claude API 키 | Yes |
| `GEMINI_API_KEY` | Google Gemini API 키 | Yes |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST 토큰 | Yes |
| `R2_ENDPOINT` | Cloudflare R2 엔드포인트 | Yes |
| `R2_ACCESS_KEY_ID` | R2 액세스 키 | Yes |
| `R2_SECRET_ACCESS_KEY` | R2 시크릿 키 | Yes |
| `R2_BUCKET_NAME` | R2 버킷 이름 | Yes |
| `R2_CDN_URL` | R2 CDN/퍼블릭 URL | Yes |
| `RESEND_API_KEY` | Resend 이메일 API 키 | Yes |
| `EMAIL_FROM` | 발신 이메일 주소 | Yes |
| `VERCEL_TOKEN` | Vercel API 토큰 (커스텀 도메인) | Yes |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID | Yes |
| `VERCEL_TEAM_ID` | Vercel 팀 ID | Yes |
| `PAYAPP_USER_ID` | PayApp 결제 사용자 ID | Yes |
| `PAYAPP_LINK_KEY` | PayApp 링크 키 | Yes |
| `PAYAPP_LINK_VAL` | PayApp 링크 값 | Yes |
| `PAYAPP_FEEDBACK_URL` | PayApp 결제 콜백 URL | Yes |
| `CRON_SECRET` | Cron 엔드포인트 보안 토큰 | Yes |
| `SENTRY_DSN` | Sentry DSN (서버) | Recommended |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (클라이언트) | Recommended |
| `SENTRY_ORG` | Sentry 조직명 | Recommended |
| `SENTRY_PROJECT` | Sentry 프로젝트명 | Recommended |
| `SENTRY_AUTH_TOKEN` | Sentry 소스맵 업로드 토큰 | Recommended |

### Railway (Worker)

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | Yes |
| `REDIS_URL` | Redis 연결 문자열 (BullMQ용) | Yes |
| `ANTHROPIC_API_KEY` | Claude API 키 | Yes |
| `GEMINI_API_KEY` | Google Gemini API 키 | Yes |
| `R2_ENDPOINT` | Cloudflare R2 엔드포인트 | Yes |
| `R2_ACCESS_KEY_ID` | R2 액세스 키 | Yes |
| `R2_SECRET_ACCESS_KEY` | R2 시크릿 키 | Yes |
| `R2_BUCKET_NAME` | R2 버킷 이름 | Yes |
| `R2_CDN_URL` | R2 CDN URL | Yes |

---

## 2. 배포 전 점검

### 빌드 확인
- [x] `npm run build` 성공 (exit 0)
- [x] TypeScript 컴파일 오류 없음
- [x] 28개 라우트 정상 빌드 (13 static + 15 dynamic)

### 설정 파일 확인
- [x] `vercel.json` — 프레임워크, cron 3개, 보안 헤더 설정 완료
- [x] `railway.json` — Nixpacks 빌드, worker.js 시작 명령어 설정 완료
- [x] `.vercel/` 디렉토리 존재 (Vercel CLI 연동 완료)
- [x] Vercel CLI v48.1.6 설치됨

### Sentry 에러 모니터링
- [x] `sentry.client.config.ts` — 클라이언트 설정 (replays, 에러 필터링)
- [x] `sentry.server.config.ts` — 서버 설정
- [x] `sentry.edge.config.ts` — Edge 런타임 설정
- [x] `src/instrumentation.ts` — 런타임별 초기화
- [x] `src/app/global-error.tsx` — 글로벌 에러 UI + Sentry 캡처
- [x] 소스맵 자동 업로드 + 삭제 설정

### 보안 헤더
- [x] `X-Content-Type-Options: nosniff` (next.config.ts + vercel.json)
- [x] `X-Frame-Options: DENY` (next.config.ts + vercel.json)
- [x] `Referrer-Policy: strict-origin-when-cross-origin` (next.config.ts)
- [x] API 라우트 보안 헤더 (vercel.json)
- [x] 공개 페이지 캐시 설정 (vercel.json)

### 코드 품질
- [x] console.log 없음 (API 라우트 전체)
- [x] .env 파일 gitignore 설정됨
- [x] 하드코딩된 시크릿 없음

---

## 3. 발견된 이슈

### 해결 완료
- [x] `.env.example`에 `AUTH_SECRET` 누락 — 추가 완료
- [x] `.env.example`에 Sentry 환경변수 누락 — 추가 완료

### 경고 (배포 차단 아님)
- [ ] **Sentry `disableLogger` 지원 중단 경고**: `next.config.ts`에서 `disableLogger: true` 사용 중. 향후 `webpack.treeshake.removeDebugLogging`으로 마이그레이션 필요 (Turbopack 미지원)
- [ ] **middleware 파일 컨벤션 지원 중단**: Next.js 16에서 `middleware.ts` → `proxy.ts` 마이그레이션 권장
- [ ] **API 라우트 try/catch 미적용 (17/28)**: `admin/coupons`, `admin/plans`, `admin/credits`, `admin/billing`, `billing/coupon`, `billing/credits`, `billing/trial`, `projects` (CRUD), `projects/[id]` (GET/PATCH), `projects/[id]/preview`, `projects/[id]/analytics`, `projects/[id]/diagnosis`, `projects/[id]/ab-test`, `projects/[id]/export`, `upload` — Prisma 에러 시 500 노출 가능. Sentry `onRequestError`가 캐치하지만, 사용자에게 친화적 에러 메시지 반환을 위해 try/catch 추가 권장
- [ ] **localhost 참조**: `src/app/api/projects/[id]/export/route.ts` 232행에 `http://localhost:3000` 문자열 존재 — 내보내기 ZIP의 README 내용이므로 배포 기능에는 무관

---

## 4. 배포 명령어

### Vercel (프로덕션)
```bash
# 프리뷰 배포
npx vercel

# 프로덕션 배포
npx vercel --prod
```

### Railway (Worker)
```bash
# Railway CLI로 배포
railway up
```

---

## 5. 배포 후 검증

### 즉시 확인
- [ ] 홈페이지 (/) 접속 확인
- [ ] Google OAuth 로그인 동작 확인
- [ ] 프로젝트 생성 → 페이지 생성 플로우 테스트
- [ ] Sentry 대시보드에서 이벤트 수신 확인

### Cron 작업 확인
- [ ] `/api/cron/subscription-expire` — 매일 03:00 UTC
- [ ] `/api/cron/daily-diagnosis` — 매일 04:00 UTC
- [ ] `/api/cron/usage-alert` — 매일 09:00 UTC
- [ ] Vercel Cron 대시보드에서 스케줄 등록 확인

### 결제 확인
- [ ] PayApp 웹훅 URL이 프로덕션 도메인으로 설정됨
- [ ] 테스트 결제 → 웹훅 수신 확인

### Worker 확인 (Railway)
- [ ] Worker 프로세스 정상 기동 확인
- [ ] BullMQ 큐 연결 확인 (Redis)
- [ ] 페이지 생성 요청 → Worker 처리 확인

### 모니터링
- [ ] Sentry 에러 알림 설정
- [ ] Vercel Analytics 활성화
- [ ] Railway 로그 모니터링
