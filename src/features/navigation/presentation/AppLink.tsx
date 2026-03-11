'use client';

import { type FC, type JSX } from 'react';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';

import { useAppLink } from '@/features/navigation/application/useAppLink';
import { classNames } from '@/shared/lib/classnames';

import './AppLink.css';

export interface AppLinkProps
  extends NextLinkProps,
    Omit<JSX.IntrinsicElements['a'], 'href'> {}

export const AppLink: FC<AppLinkProps> = ({
  className,
  onClick: propsOnClick,
  href,
  ...rest
}) => {
  const onClick = useAppLink(href, propsOnClick);

  return (
    <NextLink
      {...rest}
      href={href}
      onClick={onClick}
      className={classNames(className, 'link')}
    />
  );
};