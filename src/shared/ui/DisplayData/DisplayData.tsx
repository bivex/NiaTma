import { Cell, Checkbox, Section } from '@telegram-apps/telegram-ui';
import type { FC, ReactNode } from 'react';

import type { DisplayDataRow } from '@/shared/domain/display-data';
import { bem } from '@/shared/lib/bem';
import { Link } from '@/shared/ui/Link/Link';
import { RGB } from '@/shared/ui/RGB/RGB';

import './DisplayData.css';

const [, e] = bem('display-data');

export interface DisplayDataProps {
  header?: ReactNode;
  footer?: ReactNode;
  rows: DisplayDataRow[];
}

export const DisplayData: FC<DisplayDataProps> = ({ header, footer, rows }) => (
  <Section header={header} footer={footer}>
    {rows.map((item) => {
      let valueNode: ReactNode;

      switch (item.value.kind) {
        case 'link':
          valueNode = <Link href={item.value.href || '#'}>{item.value.label || 'Open'}</Link>;
          break;
        case 'boolean':
          valueNode = <Checkbox checked={item.value.checked} disabled />;
          break;
        case 'color':
          valueNode = <RGB color={item.value.color} />;
          break;
        case 'text':
        default:
          valueNode = item.value.text === undefined ? <i>empty</i> : item.value.text;
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