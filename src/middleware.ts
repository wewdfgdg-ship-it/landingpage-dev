import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// AUTH 임시 비활성화 — Google OAuth 수정 후 복원
export default function middleware(_req: NextRequest): NextResponse {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
