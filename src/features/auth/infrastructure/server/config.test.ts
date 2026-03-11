import { describe, expect, test } from 'bun:test';

import { canUseDevLogin, canUseTelegramAuth, createAuthConfig } from './config';

describe('auth config', () => {
  test('enables preview login by default outside production', () => {
    const config = createAuthConfig({ NODE_ENV: 'development' });

    expect(config.sessionSecret).toBe('nia-dev-session-secret');
    expect(canUseDevLogin(config)).toBe(true);
    expect(canUseTelegramAuth(config)).toBe(false);
  });

  test('requires explicit secrets in production', () => {
    const config = createAuthConfig({ NODE_ENV: 'production' });

    expect(config.sessionSecret).toBeUndefined();
    expect(canUseDevLogin(config)).toBe(false);
  });
});