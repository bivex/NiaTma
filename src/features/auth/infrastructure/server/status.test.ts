import { describe, expect, test } from 'bun:test';

import { createAuthConfig } from './config';
import { createAnonymousAuthStatus, createAuthenticatedAuthStatus } from './status';

describe('auth status builders', () => {
  test('builds anonymous status with capabilities', () => {
    const status = createAnonymousAuthStatus(createAuthConfig({ NODE_ENV: 'development' }));

    expect(status).toEqual({
      status: 'anonymous',
      capabilities: {
        telegramAuthAvailable: false,
        sessionSigningConfigured: true,
        devLoginAvailable: true,
      },
    });
  });

  test('builds authenticated status with session', () => {
    const config = createAuthConfig({
      NODE_ENV: 'development',
      TELEGRAM_BOT_TOKEN: '123:abc',
    });

    const session = {
      sub: 'dev:1',
      provider: 'dev' as const,
      issuedAt: 1,
      expiresAt: 2,
      user: { id: '1', firstName: 'Local' },
    };

    expect(createAuthenticatedAuthStatus(config, session)).toEqual({
      status: 'authenticated',
      capabilities: {
        telegramAuthAvailable: true,
        sessionSigningConfigured: true,
        devLoginAvailable: true,
      },
      session,
    });
  });
});