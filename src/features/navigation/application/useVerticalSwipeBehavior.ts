'use client';

import { useEffect } from 'react';

import { telegramSwipeService } from '../infrastructure/telegram';

export function useVerticalSwipeBehavior(allowVerticalSwipe: boolean) {
  useEffect(() => {
    try {
      telegramSwipeService.mount();

      if (allowVerticalSwipe) {
        telegramSwipeService.enableVertical();
      } else {
        telegramSwipeService.disableVertical();
      }
    } catch {
      // feature not available in current environment
    }

    return () => {
      try {
        telegramSwipeService.unmount();
      } catch {
        // feature not available in current environment
      }
    };
  }, [allowVerticalSwipe]);
}
