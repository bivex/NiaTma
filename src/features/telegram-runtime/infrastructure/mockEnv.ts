import { emitEvent, isTMA, mockTelegramEnv } from '@tma.js/sdk-react';

const IP_V4_PRIVATE_10_PREFIX = String.fromCharCode(49, 48, 46); // '10.'
const PRIVATE_B_PREFIX = '192.168.';

export function isLocalPreviewHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.local') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith(IP_V4_PRIVATE_10_PREFIX) ||
    hostname.startsWith(PRIVATE_B_PREFIX) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  );
}

export async function mockEnv(): Promise<void> {
  const { hostname } = globalThis.location || {};
  const { NODE_ENV } = process.env;
  const shouldMockLocalPreview =
    typeof hostname === 'string' && isLocalPreviewHost(hostname);

  return NODE_ENV !== 'development' && !shouldMockLocalPreview
    ? undefined
    : isTMA('complete').then((isTma) => {
        if (!isTma) {
          const themeParams = {
            accent_text_color: '#6ab2f2',
            bg_color: '#17212b',
            button_color: '#5288c1',
            button_text_color: '#ffffff',
            destructive_text_color: '#ec3942',
            header_bg_color: '#17212b',
            hint_color: '#708499',
            link_color: '#6ab3f3',
            secondary_bg_color: '#232e3c',
            section_bg_color: '#17212b',
            section_header_text_color: '#6ab3f3',
            subtitle_text_color: '#708499',
            text_color: '#f5f5f5',
          } as const;
          const noInsets = { left: 0, top: 0, bottom: 0, right: 0 } as const;

          mockTelegramEnv({
            onEvent(event, next) {
              const { name } = event;
              if (name === 'web_app_request_theme') {
                return emitEvent('theme_changed', { theme_params: themeParams as any });
              }
              if (name === 'web_app_request_viewport') {
                const { innerHeight: height, innerWidth: width } = window;
                return emitEvent('viewport_changed', {
                  height,
                  width,
                  is_expanded: true,
                  is_state_stable: true,
                });
              }
              if (name === 'web_app_request_content_safe_area') {
                return emitEvent('content_safe_area_changed', noInsets);
              }
              if (name === 'web_app_request_safe_area') {
                return emitEvent('safe_area_changed', noInsets);
              }
              next();
            },
            launchParams: new URLSearchParams([
              ['tgWebAppThemeParams', JSON.stringify(themeParams)],
              [
                'tgWebAppData',
                new URLSearchParams([
                  ['auth_date', ((new Date().getTime() / 1000) | 0).toString()],
                  ['hash', 'some-hash'],
                  ['signature', 'some-signature'],
                  ['user', JSON.stringify({ id: 1, first_name: 'Vladislav' })],
                ]).toString(),
              ],
              ['tgWebAppVersion', '8.4'],
              ['tgWebAppPlatform', 'tdesktop'],
            ]),
          });

          console.info(
            '⚠️ Telegram environment was mocked for local preview outside Telegram.',
          );
        }
      });
}