'use client';

import { useEffect } from 'react';

import { disableVerticalSwipe, enableVerticalSwipe, mountSwipeBehavior, unmountSwipeBehavior } from '../infrastructure/telegram';

export function useVerticalSwipeBehavior(allowVerticalSwipe: boolean) {
  useEffect(() => {
    try {
      mountSwipeBehavior();

      if (allowVerticalSwipe) {
        enableVerticalSwipe();
      } else {
        disableVerticalSwipe();
      }
    } catch {
      // feature not available in current environment
    }

    return () => {
      try {
        unmountSwipeBehavior();
      } catch {
        // feature not available in current environment
      }
    };
  }, [allowVerticalSwipe]);
}