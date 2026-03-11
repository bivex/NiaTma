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

export async function readAuthSessionStatus(config: AuthConfig): Promise<{
  status: AuthSessionStatus;
  shouldClearCookie: boolean;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value;

  if (!token || !config.sessionSecret) {
    return {
      status: createAnonymousAuthStatus(config),
      shouldClearCookie: Boolean(token && !config.sessionSecret),
    };
  }

  const session = decodeAuthSession(token, config.sessionSecret);

  if (!session.valid) {
    return {
      status: createAnonymousAuthStatus(config),
      shouldClearCookie: true,
    };
  }

  return {
    status: createAuthenticatedAuthStatus(config, session.session),
    shouldClearCookie: false,
  };
}