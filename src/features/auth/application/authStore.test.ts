import { describe, expect, test } from 'bun:test';

import { sanitizePersistedAuthProfile, sanitizePersistedAuthSessionStatus } from './authStore';

describe('authStore', () => {
  test('keeps active authenticated session snapshots', () => {
    expect(
      sanitizePersistedAuthSessionStatus(
        {
          status: 'authenticated',
          capabilities: { telegramAuthAvailable: true, sessionSigningConfigured: true, devLoginAvailable: false },
          session: { sub: 'telegram:1', provider: 'telegram', issuedAt: 1_000, expiresAt: 2_000, user: { id: '1' } },
        },
        1_500,
      ),
    )?.toMatchObject({ status: 'authenticated', session: { sub: 'telegram:1' } });
  });

  test('drops expired persisted auth snapshots', () => {
    expect(
      sanitizePersistedAuthSessionStatus(
        {
          status: 'authenticated',
          capabilities: { telegramAuthAvailable: false, sessionSigningConfigured: true, devLoginAvailable: true },
          session: { sub: 'dev:1', provider: 'dev', issuedAt: 1_000, expiresAt: 2_000, user: { id: '1' } },
        },
        2_500,
      ),
    ).toEqual({
      status: 'anonymous',
      capabilities: { telegramAuthAvailable: false, sessionSigningConfigured: true, devLoginAvailable: true },
    });

    expect(
      sanitizePersistedAuthProfile(
        {
          subject: 'dev:1',
          provider: 'dev',
          userId: '1',
          issuedAt: 1_000,
          expiresAt: 2_000,
        },
        2_500,
      ),
    ).toBeUndefined();
  });
});