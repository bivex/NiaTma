'use client';

import { Cell, Section } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';
import type { FC, ReactNode } from 'react';

import { AppLink } from '@/features/navigation/presentation/AppLink';
import type { DisplayDataRow, DisplayDataValue } from '@/shared/domain/display-data';
import { bem } from '@/shared/lib/bem';
import { RGB } from '@/shared/ui/RGB/RGB';

import './DisplayData.css';

const [, e] = bem('display-data');

export interface DisplayDataProps {
  header?: ReactNode;
  footer?: ReactNode;
  rows: DisplayDataRow[];
}

const DisplayValue: FC<{ value: DisplayDataValue }> = ({ value }) => {
  const t = useTranslations('shared.displayData');

  switch (value.kind) {
    case 'link':
      return (
        <AppLink href={value.href || '#'}>
          {value.label || t('open')}
        </AppLink>
      );
    case 'boolean':
      return value.checked ? t('yes') : t('no');
    case 'color':
      return <RGB color={value.color} />;
    case 'text':
    default:
      return value.text === undefined ? <i>{t('empty')}</i> : value.text;
  }
};

export const DisplayData: FC<DisplayDataProps> = ({ header, footer, rows }) => {
  return (
    <Section>
      {(header || footer) && (
        <div className={e('meta')}>
          {header && <div className={e('header')}>{header}</div>}
          {footer && <div className={e('footer')}>{footer}</div>}
        </div>
      )}
      {rows.map((item) => (
        <Cell
          key={item.title}
          className={e('line')}
          subhead={item.title}
          readOnly
          multiline
        >
          <span className={e('line-value')}>
            <DisplayValue value={item.value} />
          </span>
        </Cell>
      ))}
    </Section>
  );
};
