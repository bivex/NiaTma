import { retrieveLaunchParams } from '@tma.js/sdk-react';

import { initTelegramRuntime } from './init';
import { mockEnv } from './mockEnv';

export async function bootstrapTelegramRuntime() {
  await mockEnv();

  try {
    const launchParams = retrieveLaunchParams();
    const platform = launchParams.tgWebAppPlatform;
    const debug =
      (launchParams.tgWebAppStartParam || '').includes('debug') ||
      process.env.NODE_ENV === 'development';

    await initTelegramRuntime({
      debug,
      eruda: debug && ['ios', 'android'].includes(platform),
      mockForMacOS: platform === 'macos',
    });
  } catch (error) {
    console.log(error);
  }
}