import { LOCALE_COOKIE_NAME, resolveLocale, type Locale } from '../domain/locale';

export function persistLocale(locale: string | Locale): Locale {
  const nextLocale = resolveLocale(locale);
  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(nextLocale)}; path=/; max-age=31536000; samesite=lax`;
  return nextLocale;
}