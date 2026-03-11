'use client';

import { type JSX, type MouseEventHandler, useCallback } from 'react';
import type { LinkProps as NextLinkProps } from 'next/link';

import { getHrefPath, isExternalUrl } from '../domain/links';
import { openExternalLink } from '../infrastructure/telegram';

export function useAppLink(
  href: NextLinkProps['href'],
  propsOnClick?: JSX.IntrinsicElements['a']['onClick'],
) {
  return useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      propsOnClick?.(event);

      const path = getHrefPath(href);
      const targetUrl = new URL(path, window.location.toString());
      const currentUrl = new URL(window.location.toString());

      if (isExternalUrl(targetUrl, currentUrl)) {
        event.preventDefault();
        openExternalLink(targetUrl.toString());
      }
    },
    [href, propsOnClick],
  );
}