'use client';

import { Select } from '@telegram-apps/telegram-ui';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { localesMap, resolveLocale } from '../domain/locale';
import { persistLocale } from '../infrastructure/browser';

export function LocaleSwitcher() {
  const locale = resolveLocale(useLocale());
  const router = useRouter();

  const onChange = (value: string) => {
    const nextLocale = persistLocale(value);

    if (nextLocale !== locale) {
      router.refresh();
    }
  };

  return (
    <Select value={locale} onChange={({ target }) => onChange(target.value)}>
      {localesMap.map((entry) => (
        <option key={entry.key} value={entry.key}>
          {entry.title}
        </option>
      ))}
    </Select>
  );
}