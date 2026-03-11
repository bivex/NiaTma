'use client';

import {
  hapticFeedback,
  useSignal,
  type ImpactHapticFeedbackStyle,
  type NotificationHapticFeedbackType,
} from '@tma.js/sdk-react';
import { useCallback } from 'react';

export function useTelegramHaptics() {
  const isSupported = useSignal(hapticFeedback.isSupported);

  const impact = useCallback(
    (style: ImpactHapticFeedbackStyle) => {
      if (!isSupported) {
        return false;
      }

      try {
        hapticFeedback.impactOccurred(style);
        return true;
      } catch {
        return false;
      }
    },
    [isSupported],
  );

  const notify = useCallback(
    (type: NotificationHapticFeedbackType) => {
      if (!isSupported) {
        return false;
      }

      try {
        hapticFeedback.notificationOccurred(type);
        return true;
      } catch {
        return false;
      }
    },
    [isSupported],
  );

  const select = useCallback(() => {
    if (!isSupported) {
      return false;
    }

    try {
      hapticFeedback.selectionChanged();
      return true;
    } catch {
      return false;
    }
  }, [isSupported]);

  return { isSupported, impact, notify, select };
}