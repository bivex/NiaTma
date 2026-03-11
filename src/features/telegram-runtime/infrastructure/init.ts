import {
  backButton,
  emitEvent,
  init as initSDK,
  initData,
  miniApp,
  mockTelegramEnv,
  retrieveLaunchParams,
  setDebug,
  themeParams,
  type ThemeParams,
  viewport,
} from '@tma.js/sdk-react';

const isDevelopmentBuild = process.env.NODE_ENV === 'development';

export function shouldInitEruda(eruda: boolean, isDevelopment = isDevelopmentBuild): boolean {
  return isDevelopment && eruda;
}

export async function initTelegramRuntime(options: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
}): Promise<void> {
  setDebug(options.debug);
  initSDK();

  if (isDevelopmentBuild && options.eruda) {
    void import('./eruda').then(({ mountEruda }) => {
      void mountEruda();
    });
  }

  if (options.mockForMacOS) {
    let firstThemeSent = false;

    mockTelegramEnv({
      onEvent(event, next) {
        if (event.name === 'web_app_request_theme') {
          let params: Partial<ThemeParams> = {};

          if (firstThemeSent) {
            params = themeParams.state as Partial<ThemeParams>;
          } else {
            firstThemeSent = true;
            params = (retrieveLaunchParams().tgWebAppThemeParams || {}) as Partial<ThemeParams>;
          }

          return emitEvent('theme_changed', { theme_params: params as any });
        }

        if (event.name === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          });
        }

        next();
      },
    });
  }

  backButton.mount();
  initData.restore();

  try {
    miniApp.mount();
    themeParams.bindCssVars();
  } catch {
    // miniApp not available
  }

  try {
    viewport.mount().then(() => {
      viewport.bindCssVars();
    });
  } catch {
    // viewport not available
  }
}