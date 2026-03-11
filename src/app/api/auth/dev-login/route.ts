import { NextResponse } from 'next/server';

import { createAuthConfig, canUseDevLogin } from '@/features/auth/infrastructure/server/config';
import {
  AUTH_SESSION_COOKIE_NAME,
  buildSessionCookieOptions,
  createAuthSession,
  encodeAuthSession,
} from '@/features/auth/infrastructure/server/session';
import { createAuthenticatedAuthStatus } from '@/features/auth/infrastructure/server/status';

export const dynamic = 'force-dynamic';

export async function POST() {
  const config = createAuthConfig();

  if (!canUseDevLogin(config) || !config.sessionSecret) {
    return NextResponse.json({ message: 'Local preview login is disabled.' }, { status: 403 });
  }

  const session = createAuthSession({
    provider: 'dev',
    user: {
      id: 'local-preview',
      firstName: 'Local',
      lastName: 'Preview',
      username: 'dev',
    },
    ttlSeconds: config.sessionTtlSeconds,
  });

  const response = NextResponse.json(createAuthenticatedAuthStatus(config, session), {
    headers: { 'cache-control': 'no-store' },
  });

  response.cookies.set({
    name: AUTH_SESSION_COOKIE_NAME,
    value: encodeAuthSession(session, config.sessionSecret),
    ...buildSessionCookieOptions(session.expiresAt, config.secureCookies),
  });

  return response;
}