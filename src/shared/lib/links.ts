import type { LinkProps as NextLinkProps } from 'next/link';

type LinkHref = NextLinkProps['href'];

export function getHrefPath(href: LinkHref): string {
  if (typeof href === 'string') {
    return href;
  }

  const { search = '', pathname = '', hash = '' } = href;
  return `${pathname}${search ? `?${search}` : ''}${hash || ''}`;
}

export function isExternalUrl(targetUrl: URL, currentUrl: URL): boolean {
  return (
    targetUrl.protocol !== currentUrl.protocol ||
    targetUrl.host !== currentUrl.host
  );
}