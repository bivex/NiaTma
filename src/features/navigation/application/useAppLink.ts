'use client';

import { type JSX, type MouseEventHandler, useCallback } from 'react';
import type { LinkProps as NextLinkProps } from 'next/link';

import { getHrefPath, isExternalUrl } from '../domain/links';
import { telegramNavigationService } from '../infrastructure/telegram';

function isOriginSame(p1: string, h1: string, p2: string, h2: string): boolean {
  return p1 === p2 && h1 === h2;
}

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

      const targetProtocol = targetUrl.protocol;
      const targetHost = targetUrl.host;
      const currentProtocol = currentUrl.protocol;
      const currentHost = currentUrl.host;

      if (!isOriginSame(targetProtocol, targetHost, currentProtocol, currentHost)) {
        event.preventDefault();
        telegramNavigationService.openExternalLink(targetUrl.toString());
      }
    },
    [href, propsOnClick],
  );
}
