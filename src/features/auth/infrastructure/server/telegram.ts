import { createHmac, timingSafeEqual } from 'node:crypto';

import type { AuthSessionUser } from '../../domain/models';

interface TelegramInitDataUserDto {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface VerifiedTelegramInitData {
  authDate: number;
  user: AuthSessionUser;
}

export type TelegramInitDataVerificationResult =
  | { ok: true; data: VerifiedTelegramInitData }
  | { ok: false; reason: string };

function buildDataCheckString(params: URLSearchParams) {
  return [...params.entries()]
    .filter(([key]) => key !== 'hash')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

function createTelegramSecret(botToken: string) {
  return createHmac('sha256', 'WebAppData').update(botToken).digest();
}

function createTelegramHash(dataCheckString: string, botToken: string) {
  return createHmac('sha256', createTelegramSecret(botToken)).update(dataCheckString).digest('hex');
}

function safeCompareHex(left: string, right: string) {
  const leftBuffer = Buffer.from(left, 'hex');
  const rightBuffer = Buffer.from(right, 'hex');

  if (leftBuffer.length === 0 || leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parseTelegramUser(value: string | null): AuthSessionUser | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const user = JSON.parse(value) as TelegramInitDataUserDto;

    if (user.id === undefined || user.id === null) {
      return undefined;
    }

    return {
      id: String(user.id),
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
    };
  } catch {
    return undefined;
  }
}

export function verifyTelegramInitData(
  rawInitData: string,
  botToken: string,
  options: { nowMs?: number; maxAgeSeconds?: number } = {},
): TelegramInitDataVerificationResult {
  const params = new URLSearchParams(rawInitData);
  const hash = params.get('hash');

  if (!hash) {
    return { ok: false, reason: 'missing_hash' };
  }

  const authDate = Number(params.get('auth_date'));

  if (!Number.isFinite(authDate)) {
    return { ok: false, reason: 'invalid_auth_date' };
  }

  const nowMs = options.nowMs ?? Date.now();
  const maxAgeSeconds = options.maxAgeSeconds ?? 60 * 60 * 24;

  if (authDate * 1000 < nowMs - maxAgeSeconds * 1000) {
    return { ok: false, reason: 'expired' };
  }

  const expectedHash = createTelegramHash(buildDataCheckString(params), botToken);

  if (!safeCompareHex(hash, expectedHash)) {
    return { ok: false, reason: 'invalid_hash' };
  }

  const user = parseTelegramUser(params.get('user'));

  if (!user) {
    return { ok: false, reason: 'missing_user' };
  }

  return {
    ok: true,
    data: {
      authDate,
      user,
    },
  };
}