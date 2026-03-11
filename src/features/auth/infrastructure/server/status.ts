import { cookies } from 'next/headers';

import type { AuthCapabilities, AuthSession, AuthSessionStatus } from '../../domain/models';
import { canSignSessions, canUseDevLogin, canUseTelegramAuth, type AuthConfig } from './config';
import { AUTH_SESSION_COOKIE_NAME, decodeAuthSession } from './session';

export function buildAuthCapabilities(config: AuthConfig): AuthCapabilities {
  return {
    telegramAuthAvailable: canUseTelegramAuth(config),
    sessionSigningConfigured: canSignSessions(config),
    devLoginAvailable: canUseDevLogin(config),
  };
}

export function createAnonymousAuthStatus(config: AuthConfig): AuthSessionStatus {
  return {
    status: 'anonymous',
    capabilities: buildAuthCapabilities(config),
  };
}

export function createAuthenticatedAuthStatus(
  config: AuthConfig,
  session: AuthSession,
): AuthSessionStatus {
  return {
    status: 'authenticated',
    capabilities: buildAuthCapabilities(config),
    session,
  };
}

async function readCurrentAuthSession(config: AuthConfig): Promise<{
  session?: AuthSession;
  shouldClearCookie: boolean;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;

  if (!token || !config.sessionSecret) {
    return {
      session: undefined,
      shouldClearCookie: Boolean(token && !config.sessionSecret),
    };
  }

  const session = decodeAuthSession(token, config.sessionSecret);

  if (!session.valid) {
    return {
      session: undefined,
      shouldClearCookie: true,
    };
  }

  return {
    session: session.session,
    shouldClearCookie: false,
  };
}

export async function readAuthenticatedAuthSession(config: AuthConfig): Promise<{
  session?: AuthSession;
  shouldClearCookie: boolean;
}> {
  return readCurrentAuthSession(config);
}

export async function readAuthSessionStatus(config: AuthConfig): Promise<{
  status: AuthSessionStatus;
  shouldClearCookie: boolean;
}> {
  const current = await readCurrentAuthSession(config);

  if (!current.session) {
    return {
      status: createAnonymousAuthStatus(config),
      shouldClearCookie: current.shouldClearCookie,
    };
  }

  return {
    status: createAuthenticatedAuthStatus(config, current.session),
    shouldClearCookie: current.shouldClearCookie,
  };
}