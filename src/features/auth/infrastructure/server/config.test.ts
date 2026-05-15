import { describe, expect, test } from 'bun:test';

import { getAuthCapabilities, createAuthConfig } from './config';

describe('auth config', () => {
  test('enables preview login by default outside production', () => {
    const config = createAuthConfig({ NODE_ENV: 'development' });
    const capabilities = getAuthCapabilities(config);

    expect(config.sessionSecret).toBe('nia-dev-session-secret');
    expect(capabilities.devLoginAvailable).toBe(true);
    expect(capabilities.telegramAuthAvailable).toBe(false);
  });

  test('requires explicit secrets in production', () => {
    const config = createAuthConfig({ NODE_ENV: 'production' });
    const capabilities = getAuthCapabilities(config);

    expect(config.sessionSecret).toBeUndefined();
    expect(capabilities.devLoginAvailable).toBe(false);
  });
});
