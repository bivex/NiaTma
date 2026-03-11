'use client';

import { useId } from 'react';
import { Select } from '@telegram-apps/telegram-ui';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { localesMap, resolveLocale } from '../domain/locale';
import { persistLocale } from '../infrastructure/browser';

export function LocaleSwitcher({ label }: { label: string }) {
  const locale = resolveLocale(useLocale());
  const router = useRouter();
  const selectId = useId();

  const onChange = (value: string) => {
    const nextLocale = persistLocale(value);

    if (nextLocale !== locale) {
      router.refresh();
    }
  };

  return (
    <>
      <label className="visually-hidden" htmlFor={selectId}>
        {label}
      </label>
      <Select
        id={selectId}
        value={locale}
        onChange={({ target }) => onChange(target.value)}
      >
        {localesMap.map((entry) => (
          <option key={entry.key} value={entry.key}>
            {entry.title}
          </option>
        ))}
      </Select>
    </>
  );
}