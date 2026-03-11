import { describe, expect, test } from 'bun:test';

import { createAuthSession, decodeAuthSession, encodeAuthSession } from './session';

describe('auth session token', () => {
  test('encodes and decodes a valid session', () => {
    const session = createAuthSession({
      provider: 'telegram',
      user: { id: '1', firstName: 'Nia' },
      ttlSeconds: 60,
      nowMs: 1_000,
    });

    const token = encodeAuthSession(session, 'secret');

    expect(decodeAuthSession(token, 'secret', 1_500)).toEqual({ valid: true, session });
  });

  test('rejects tampered sessions', () => {
    const session = createAuthSession({
      provider: 'dev',
      user: { id: 'dev-preview' },
      ttlSeconds: 60,
      nowMs: 1_000,
    });

    const token = `${encodeAuthSession(session, 'secret')}x`;

    expect(decodeAuthSession(token, 'secret', 1_500)).toEqual({
      valid: false,
      reason: 'invalid_signature',
    });
  });
});