export interface AppFeatureConfig {
  applicationDiagnostics: boolean;
  platformDemo: boolean;
  telegramHaptics: boolean;
  telegramMainButton: boolean;
  swipeBackNavigation: boolean;
  verticalSwipeBehavior: boolean;
  tonConnect: boolean;
}

export interface AppConfig {
  appName: string;
  isDevelopment: boolean;
  features: AppFeatureConfig;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

export function createAppConfig(
  env: Record<string, string | undefined> = process.env,
): AppConfig {
  return {
    appName: env.NEXT_PUBLIC_APP_NAME || 'NiaTma',
    isDevelopment: env.NODE_ENV === 'development',
    features: {
      applicationDiagnostics: parseBoolean(env.NEXT_PUBLIC_ENABLE_APPLICATION_DIAGNOSTICS, true),
      platformDemo: parseBoolean(env.NEXT_PUBLIC_ENABLE_PLATFORM_DEMO, true),
      telegramHaptics: parseBoolean(env.NEXT_PUBLIC_ENABLE_TELEGRAM_HAPTICS, true),
      telegramMainButton: parseBoolean(env.NEXT_PUBLIC_ENABLE_TELEGRAM_MAIN_BUTTON, true),
      swipeBackNavigation: parseBoolean(env.NEXT_PUBLIC_ENABLE_SWIPE_BACK_NAVIGATION, true),
      verticalSwipeBehavior: parseBoolean(env.NEXT_PUBLIC_ENABLE_VERTICAL_SWIPE_BEHAVIOR, true),
      tonConnect: parseBoolean(env.NEXT_PUBLIC_ENABLE_TON_CONNECT, true),
    },
  };
}

export const appConfig = createAppConfig();