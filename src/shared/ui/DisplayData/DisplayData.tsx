'use client';

import { Cell, Section } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';
import type { FC, ReactNode } from 'react';

import { AppLink } from '@/features/navigation/presentation/AppLink';
import type { DisplayDataRow, DisplayDataValue } from '@/shared/domain/display-data';
import { RGB } from '@/shared/ui/RGB/RGB';

export interface DisplayDataProps {
  header?: ReactNode;
  footer?: ReactNode;
  rows: DisplayDataRow[];
}

const DisplayValue: FC<{ value: DisplayDataValue }> = ({ value }) => {
  const t = useTranslations('shared.displayData');
  const { kind } = value;

  switch (kind) {
    case 'link': {
      const { href = '#', label } = value;
      return <AppLink href={href}>{label || t('open')}</AppLink>;
    }
    case 'boolean': {
      const { checked } = value;
      return checked ? t('yes') : t('no');
    }
    case 'color': {
      const { color } = value;
      return <RGB color={color} />;
    }
    case 'text':
    default: {
      const { text } = value as { text?: string };
      return text === undefined ? <i>{t('empty')}</i> : text;
    }
  }
};

export const DisplayData: FC<DisplayDataProps> = ({ header, footer, rows }) => {
  return (
    <Section header={header} footer={footer}>
      {rows.map((item) => (
        <Cell
          key={item.title}
          subhead={item.title}
          readOnly
          multiline
        >
          <DisplayValue value={item.value} />
        </Cell>
      ))}
    </Section>
  );
};
