import { NextResponse } from 'next/server';

import { createAuthConfig } from '@/features/auth/infrastructure/server/config';
import { AUTH_SESSION_COOKIE_NAME } from '@/features/auth/infrastructure/server/session';
import { createAnonymousAuthStatus } from '@/features/auth/infrastructure/server/status';

export const dynamic = 'force-dynamic';

export async function POST() {
  const config = createAuthConfig();
  const response = NextResponse.json(createAnonymousAuthStatus(config), {
    headers: { 'cache-control': 'no-store' },
  });

  response.cookies.delete(AUTH_SESSION_COOKIE_NAME);

  return response;
}