import type { FC, HTMLAttributes } from 'react';

import { bem } from '@/shared/lib/bem';
import { classNames } from '@/shared/lib/classnames';

import './RGB.css';

const [b, e] = bem('rgb');

export type RGBProps = HTMLAttributes<HTMLSpanElement> & {
  color: string;
};

export const RGB: FC<RGBProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={classNames(b(), className)}>
    <i className={e('icon')} style={{ backgroundColor: color }} />
    {color}
  </span>
);