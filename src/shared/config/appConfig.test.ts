import { describe, expect, test } from 'bun:test';

import { createAppConfig } from './appConfig';

describe('appConfig', () => {
  test('uses defaults when env vars are absent', () => {
    const config = createAppConfig({ NODE_ENV: 'production' });

    expect(config.appName).toBe('NiaTma');
    expect(config.isDevelopment).toBe(false);
    expect(config.features.monetization).toBe(true);
    expect(config.features.platformDemo).toBe(true);
    expect(config.features.telegramMainButton).toBe(true);
  });

  test('parses boolean feature flags from env', () => {
    const config = createAppConfig({
      NODE_ENV: 'development',
      NEXT_PUBLIC_APP_NAME: 'Example',
      NEXT_PUBLIC_ENABLE_MONETIZATION: 'false',
      NEXT_PUBLIC_ENABLE_PLATFORM_DEMO: 'false',
      NEXT_PUBLIC_ENABLE_SWIPE_BACK_NAVIGATION: '0',
      NEXT_PUBLIC_ENABLE_TELEGRAM_HAPTICS: 'yes',
    });

    expect(config.appName).toBe('Example');
    expect(config.isDevelopment).toBe(true);
    expect(config.features.monetization).toBe(false);
    expect(config.features.platformDemo).toBe(false);
    expect(config.features.swipeBackNavigation).toBe(false);
    expect(config.features.telegramHaptics).toBe(true);
  });
});