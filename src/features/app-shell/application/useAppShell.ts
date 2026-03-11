'use client';

import { initData, miniApp, useLaunchParams, useSignal } from '@tma.js/sdk-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { resolveLocale } from '@/features/i18n/domain/locale';
import { persistLocale } from '@/features/i18n/infrastructure/browser';

export function useAppShell() {
  const launchParams = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);
  const initDataUser = useSignal(initData.user);
  const locale = resolveLocale(useLocale());
  const router = useRouter();

  useEffect(() => {
    if (!initDataUser?.language_code) {
      return;
    }

    const nextLocale = resolveLocale(initDataUser.language_code);

    if (nextLocale !== locale) {
      persistLocale(nextLocale);
      router.refresh();
    }
  }, [initDataUser?.language_code, locale, router]);

  return {
    appearance: isDark ? 'dark' : 'light',
    platform: ['macos', 'ios'].includes(launchParams.tgWebAppPlatform)
      ? 'ios'
      : 'base',
  } as const;
}