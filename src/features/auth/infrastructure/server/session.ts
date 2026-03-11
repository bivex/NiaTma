import { createHmac, timingSafeEqual } from 'node:crypto';

import type { AuthProvider, AuthSession, AuthSessionUser } from '../../domain/models';

export const AUTH_SESSION_COOKIE_NAME = 'nia_auth_session';

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAuthSession(options: {
  provider: AuthProvider;
  user: AuthSessionUser;
  ttlSeconds: number;
  nowMs?: number;
}): AuthSession {
  const now = options.nowMs ?? Date.now();

  return {
    sub: `${options.provider}:${options.user.id}`,
    provider: options.provider,
    issuedAt: now,
    expiresAt: now + options.ttlSeconds * 1000,
    user: options.user,
  };
}

export function encodeAuthSession(session: AuthSession, secret: string) {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
}

export function decodeAuthSession(
  token: string,
  secret: string,
  nowMs = Date.now(),
): { valid: true; session: AuthSession } | { valid: false; reason: string } {
  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return { valid: false, reason: 'invalid_token' };
  }

  if (!safeEqual(signature, sign(payload, secret))) {
    return { valid: false, reason: 'invalid_signature' };
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as AuthSession;

    if (typeof session.expiresAt !== 'number' || session.expiresAt <= nowMs) {
      return { valid: false, reason: 'expired' };
    }

    return { valid: true, session };
  } catch {
    return { valid: false, reason: 'invalid_payload' };
  }
}

export function buildSessionCookieOptions(expiresAt: number, secure: boolean) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure,
    path: '/',
    expires: new Date(expiresAt),
  };
}