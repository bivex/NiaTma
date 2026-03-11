import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, LOCALE_COOKIE_NAME, locales, resolveLocale } from '../domain/locale';

async function getRequestLocale() {
  return resolveLocale((await cookies()).get(LOCALE_COOKIE_NAME)?.value);
}

const i18nRequestConfig = getRequestConfig(async () => {
  const locale = await getRequestLocale();

  return {
    locale,
    messages:
      locale === defaultLocale || !locales.includes(locale)
        ? (await import(`@public/locales/${defaultLocale}.json`)).default
        : (await import(`@public/locales/${locale}.json`)).default,
  };
});

export default i18nRequestConfig;