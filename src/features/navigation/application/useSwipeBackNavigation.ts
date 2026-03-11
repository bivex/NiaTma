'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EDGE_THRESHOLD_PX = 24;
const HORIZONTAL_DISTANCE_PX = 72;
const VERTICAL_TOLERANCE_PX = 48;

export function useSwipeBackNavigation(enabled: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let startX: number | null = null;
    let startY: number | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];

      if (!touch || touch.clientX > EDGE_THRESHOLD_PX) {
        startX = null;
        startY = null;
        return;
      }

      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];

      if (!touch || startX === null || startY === null) {
        return;
      }

      const deltaX = touch.clientX - startX;
      const deltaY = Math.abs(touch.clientY - startY);

      startX = null;
      startY = null;

      if (deltaX >= HORIZONTAL_DISTANCE_PX && deltaY <= VERTICAL_TOLERANCE_PX) {
        router.back();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, router]);
}