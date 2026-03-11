'use client';

import { openLink } from '@tma.js/sdk-react';
import { type FC, type JSX, type MouseEventHandler, useCallback } from 'react';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';

import { classNames } from '@/shared/lib/classnames';
import { getHrefPath, isExternalUrl } from '@/shared/lib/links';

import './Link.css';

export interface LinkProps
  extends NextLinkProps,
    Omit<JSX.IntrinsicElements['a'], 'href'> {}

export const Link: FC<LinkProps> = ({
  className,
  onClick: propsOnClick,
  href,
  ...rest
}) => {
  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      propsOnClick?.(event);

      const path = getHrefPath(href);
      const targetUrl = new URL(path, window.location.toString());
      const currentUrl = new URL(window.location.toString());

      if (isExternalUrl(targetUrl, currentUrl)) {
        event.preventDefault();
        openLink(targetUrl.toString());
      }
    },
    [href, propsOnClick],
  );

  return (
    <NextLink
      {...rest}
      href={href}
      onClick={onClick}
      className={classNames(className, 'link')}
    />
  );
};