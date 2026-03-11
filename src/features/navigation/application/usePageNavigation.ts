'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSwipeBackNavigation } from './useSwipeBackNavigation';
import { useVerticalSwipeBehavior } from './useVerticalSwipeBehavior';
import {
  hideBackNavigation,
  onBackNavigation,
  showBackNavigation,
} from '../infrastructure/telegram';

export function usePageNavigation({
  back = true,
  swipeBack = false,
  allowVerticalSwipe = true,
}: {
  back?: boolean;
  swipeBack?: boolean;
  allowVerticalSwipe?: boolean;
} = {}) {
  const router = useRouter();

  useSwipeBackNavigation(back && swipeBack);
  useVerticalSwipeBehavior(allowVerticalSwipe);

  useEffect(() => {
    if (back) {
      showBackNavigation();
    } else {
      hideBackNavigation();
    }
  }, [back]);

  useEffect(() => {
    return onBackNavigation(() => {
      router.back();
    });
  }, [router]);
}