'use client';

import type { PropsWithChildren } from 'react';

import { usePageNavigation } from '@/features/navigation/application/usePageNavigation';

export function Page({
  children,
  back = true,
}: PropsWithChildren<{
  back?: boolean;
}>) {
  usePageNavigation(back);

  return <main>{children}</main>;
}