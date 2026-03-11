'use client';

import type { PropsWithChildren } from 'react';

import { usePageNavigation } from '@/features/navigation/application/usePageNavigation';

export function Page({
  children,
  back = true,
  swipeBack = false,
  allowVerticalSwipe = true,
}: PropsWithChildren<{
  back?: boolean;
  swipeBack?: boolean;
  allowVerticalSwipe?: boolean;
}>) {
  usePageNavigation({ back, swipeBack, allowVerticalSwipe });

  return <main>{children}</main>;
}