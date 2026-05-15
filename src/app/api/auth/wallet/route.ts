import { NextResponse } from 'next/server';

import { createAuthLinkedWallet, parseAuthLinkedWalletInput } from '@/features/auth/application/wallet';
import { createAuthConfig } from '@/features/auth/infrastructure/server/config';
import {
  AUTH_SESSION_COOKIE_NAME,
  buildSessionCookieOptions,
  encodeAuthSession,
} from '@/features/auth/infrastructure/server/session';
import { createAuthenticatedAuthStatus, readAuthenticatedAuthSession } from '@/features/auth/infrastructure/server/status';

export const dynamic = 'force-dynamic';

function createUnauthorizedResponse(shouldClearCookie: boolean) {
  const response = NextResponse.json({ message: 'Authentication required.' }, { status: 401 });

  if (shouldClearCookie) {
    response.cookies.delete(AUTH_SESSION_COOKIE_NAME);
  }

  return response;
}

function createSessionResponse(params: {
  config: ReturnType<typeof createAuthConfig>;
  session: NonNullable<Awaited<ReturnType<typeof readAuthenticatedAuthSession>>['session']>;
}) {
  const { config, session } = params;
  const { sessionSecret, secureCookies } = config;
  const { expiresAt } = session;

  const response = NextResponse.json(createAuthenticatedAuthStatus(config, session), {
    headers: { 'cache-control': 'no-store' },
  });

  if (sessionSecret) {
    response.cookies.set({
      name: AUTH_SESSION_COOKIE_NAME,
      value: encodeAuthSession(session, sessionSecret),
      ...buildSessionCookieOptions(expiresAt, secureCookies),
    });
  }

  return response;
}

export async function POST(request: Request) {
  const config = createAuthConfig();
  const { sessionSecret } = config;
  const auth = await readAuthenticatedAuthSession(config);
  const { session, shouldClearCookie } = auth;

  if (!session || !sessionSecret) {
    return createUnauthorizedResponse(shouldClearCookie);
  }

  const payload = parseAuthLinkedWalletInput(await request.json().catch(() => undefined));

  if (!payload) {
    return NextResponse.json({ message: 'Invalid TON wallet payload.' }, { status: 400 });
  }

  return createSessionResponse({
    config,
    session: {
      ...session,
      wallet: createAuthLinkedWallet(payload),
    },
  });
}

export async function DELETE() {
  const config = createAuthConfig();
  const { sessionSecret } = config;
  const auth = await readAuthenticatedAuthSession(config);
  const { session, shouldClearCookie } = auth;

  if (!session || !sessionSecret) {
    return createUnauthorizedResponse(shouldClearCookie);
  }

  return createSessionResponse({
    config,
    session: {
      ...session,
      wallet: undefined,
    },
  });
}