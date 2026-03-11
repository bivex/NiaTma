import { NextResponse } from 'next/server';

import { createAuthConfig } from '@/features/auth/infrastructure/server/config';
import { AUTH_SESSION_COOKIE_NAME } from '@/features/auth/infrastructure/server/session';
import { readAuthSessionStatus } from '@/features/auth/infrastructure/server/status';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = createAuthConfig();
  const { status, shouldClearCookie } = await readAuthSessionStatus(config);
  const response = NextResponse.json(status, {
    headers: { 'cache-control': 'no-store' },
  });

  if (shouldClearCookie) {
    response.cookies.delete(AUTH_SESSION_COOKIE_NAME);
  }

  return response;
}