'use client';

import { Cell, Checkbox, Section } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';
import type { FC, ReactNode } from 'react';

import { AppLink } from '@/features/navigation/presentation/AppLink';
import type { DisplayDataRow } from '@/shared/domain/display-data';
import { bem } from '@/shared/lib/bem';
import { RGB } from '@/shared/ui/RGB/RGB';

import './DisplayData.css';

const [, e] = bem('display-data');

export interface DisplayDataProps {
  header?: ReactNode;
  footer?: ReactNode;
  rows: DisplayDataRow[];
}

export const DisplayData: FC<DisplayDataProps> = ({ header, footer, rows }) => {
  const t = useTranslations('shared.displayData');

  return (
    <Section>
      {(header || footer) && (
        <div className={e('meta')}>
          {header && <div className={e('header')}>{header}</div>}
          {footer && <div className={e('footer')}>{footer}</div>}
        </div>
      )}
      {rows.map((item) => {
        let valueNode: ReactNode;

        switch (item.value.kind) {
          case 'link':
            valueNode = (
              <AppLink href={item.value.href || '#'}>
                {item.value.label || t('open')}
              </AppLink>
            );
            break;
          case 'boolean':
            valueNode = <Checkbox checked={item.value.checked} disabled />;
            break;
          case 'color':
            valueNode = <RGB color={item.value.color} />;
            break;
          case 'text':
          default:
            valueNode = item.value.text === undefined ? <i>{t('empty')}</i> : item.value.text;
        }

        return (
          <Cell
            key={item.title}
            className={e('line')}
            subhead={item.title}
            readOnly
            multiline
          >
            <span className={e('line-value')}>{valueNode}</span>
          </Cell>
        );
      })}
    </Section>
  );
};