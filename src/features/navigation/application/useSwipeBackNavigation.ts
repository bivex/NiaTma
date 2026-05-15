'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EDGE_THRESHOLD_PX = 24;
const HORIZONTAL_DISTANCE_PX = 72;
const VERTICAL_TOLERANCE_PX = 48;

export function useSwipeBackNavigation(enabled: boolean) {
  const router = useRouter();

  useEffect(() => {
    const r = router;
    if (!enabled) {
      return;
    }

    let startX: number | null = null;
    let startY: number | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      const touches = event.touches;
      const touch = touches[0];

      if (!touch) {
        startX = null;
        startY = null;
        return;
      }

      const { clientX, clientY } = touch;

      if (clientX > EDGE_THRESHOLD_PX) {
        startX = null;
        startY = null;
        return;
      }

      startX = clientX;
      startY = clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touches = event.changedTouches;
      const touch = touches[0];

      if (!touch || startX === null || startY === null) {
        return;
      }

      const { clientX, clientY } = touch;
      const deltaX = clientX - startX;
      const deltaY = Math.abs(clientY - startY);

      startX = null;
      startY = null;

      if (deltaX >= HORIZONTAL_DISTANCE_PX && deltaY <= VERTICAL_TOLERANCE_PX) {
        r.back();
      }
    };

    const w = window;
    const opts: AddEventListenerOptions = { passive: true };
    w.addEventListener('touchstart', handleTouchStart, opts);
    w.addEventListener('touchend', handleTouchEnd, opts);

    return () => {
      w.removeEventListener('touchstart', handleTouchStart);
      w.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, router]);
}