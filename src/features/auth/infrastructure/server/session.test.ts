import { describe, expect, test } from 'bun:test';

import { createAuthSession, decodeAuthSession, encodeAuthSession } from './session';

function encodeAndDecode(
  session: ReturnType<typeof createAuthSession>,
  secret: string,
  ttlSeconds: number,
) {
  const token = encodeAuthSession(session, secret);
  return decodeAuthSession(token, secret, ttlSeconds);
}

describe('auth session token', () => {
  test('encodes and decodes a valid session', () => {
    const session = createAuthSession({
      provider: 'telegram',
      user: { id: '1', firstName: 'Nia' },
      ttlSeconds: 60,
      nowMs: 1_000,
    });

    session.wallet = {
      address: 'EQD123',
      chain: 'testnet',
      provider: 'Tonkeeper',
      linkedAt: 1_100,
    };

    expect(encodeAndDecode(session, 'secret', 1_500)).toEqual({ valid: true, session });
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