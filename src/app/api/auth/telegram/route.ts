import { NextResponse } from 'next/server';

import { createAuthConfig, canUseTelegramAuth } from '@/features/auth/infrastructure/server/config';
import {
  AUTH_SESSION_COOKIE_NAME,
  buildSessionCookieOptions,
  createAuthSession,
  encodeAuthSession,
} from '@/features/auth/infrastructure/server/session';
import { createAuthenticatedAuthStatus } from '@/features/auth/infrastructure/server/status';
import { verifyTelegramInitData } from '@/features/auth/infrastructure/server/telegram';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const config = createAuthConfig();

  if (!canUseTelegramAuth(config) || !config.telegramBotToken || !config.sessionSecret) {
    return NextResponse.json({ message: 'Telegram auth is not configured on the server.' }, { status: 503 });
  }

  const body = (await request.json().catch(() => undefined)) as { initData?: string } | undefined;

  if (!body?.initData) {
    return NextResponse.json({ message: 'Telegram init data is required.' }, { status: 400 });
  }

  const verification = verifyTelegramInitData(body.initData, config.telegramBotToken, {
    maxAgeSeconds: config.initDataMaxAgeSeconds,
  });

  if (!verification.ok) {
    return NextResponse.json({ message: 'Telegram init data verification failed.' }, { status: 401 });
  }

  const session = createAuthSession({
    provider: 'telegram',
    user: verification.data.user,
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