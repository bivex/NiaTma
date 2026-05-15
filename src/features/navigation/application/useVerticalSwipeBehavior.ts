'use client';

import { useEffect } from 'react';

import { telegramSwipeService } from '../infrastructure/telegram';

export function useVerticalSwipeBehavior(allowVerticalSwipe: boolean) {
  useEffect(() => {
    const svc = telegramSwipeService;
    try {
      svc.mount();

      if (allowVerticalSwipe) {
        svc.enableVertical();
      } else {
        svc.disableVertical();
      }
    } catch {
      // feature not available in current environment
    }

    return () => {
      try {
        svc.unmount();
      } catch {
        // feature not available in current environment
      }
    };
  }, [allowVerticalSwipe]);
}
