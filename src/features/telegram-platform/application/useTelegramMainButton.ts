'use client';

import { mainButton } from '@tma.js/sdk-react';
import { useEffect } from 'react';

export function useTelegramMainButton({
  text,
  visible,
  enabled,
  loading,
  shine,
  onClick,
}: {
  text: string;
  visible: boolean;
  enabled: boolean;
  loading: boolean;
  shine?: boolean;
  onClick?: () => void | Promise<void>;
}) {
  useEffect(() => {
    try {
      mainButton.mount();
      mainButton.setParams({
        text,
        isVisible: visible,
        isEnabled: enabled,
        isLoaderVisible: loading,
        hasShineEffect: Boolean(shine),
      });

      if (visible) {
        mainButton.show();
      } else {
        mainButton.hide();
      }

      if (enabled) {
        mainButton.enable();
      } else {
        mainButton.disable();
      }

      if (loading) {
        mainButton.showLoader();
      } else {
        mainButton.hideLoader();
      }

      if (shine) {
        mainButton.enableShineEffect();
      } else {
        mainButton.disableShineEffect();
      }
    } catch {
      return;
    }

    const off = onClick
      ? (() => {
          try {
            return mainButton.onClick(() => {
              void onClick();
            });
          } catch {
            return undefined;
          }
        })()
      : undefined;

    return () => {
      off?.();

      try {
        mainButton.hideLoader();
        mainButton.disableShineEffect();
        mainButton.hide();
        mainButton.unmount();
      } catch {
        // feature not available in current environment
      }
    };
  }, [enabled, loading, onClick, shine, text, visible]);
}