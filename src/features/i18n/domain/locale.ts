export const defaultLocale = 'en';

export const timeZone = 'Europe/Amsterdam';

export type Locale = 'en' | 'ru';

export const locales: readonly Locale[] = [defaultLocale, 'ru'];

export const localeValues: ReadonlySet<Locale> = new Set(locales);

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const localesMap: Array<{ key: Locale; title: string }> = [
  { key: 'en', title: 'English' },
  { key: 'ru', title: 'Русский' },
];

export function resolveLocale(value?: string): Locale {
  return value && localeValues.has(value as Locale) ? (value as Locale) : (defaultLocale as Locale);
}