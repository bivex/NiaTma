export const defaultLocale = 'en';

export const timeZone = 'Europe/Amsterdam';

export const locales = [defaultLocale, 'ru'] as const;

export type Locale = (typeof locales)[number];

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const localesMap: Array<{ key: Locale; title: string }> = [
  { key: 'en', title: 'English' },
  { key: 'ru', title: 'Русский' },
];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function resolveLocale(value?: string): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}