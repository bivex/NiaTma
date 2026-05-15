'use client';

import { mainButton } from '@tma.js/sdk-react';
import { useEffect } from 'react';

export function useTelegramMainButton(props: {
  text: string;
  visible: boolean;
  enabled: boolean;
  loading: boolean;
  shine?: boolean;
  onClick?: () => void | Promise<void>;
}) {
  const { text, visible, enabled, loading, shine, onClick } = props;

  useEffect(() => {
    const btn = mainButton;
    try {
      btn.mount();
      btn.setParams({
        text,
        isVisible: visible,
        isEnabled: enabled,
        isLoaderVisible: loading,
        hasShineEffect: Boolean(shine),
      });

      if (visible) {
        btn.show();
      } else {
        btn.hide();
      }

      if (enabled) {
        btn.enable();
      } else {
        btn.disable();
      }

      if (loading) {
        btn.showLoader();
      } else {
        btn.hideLoader();
      }

      if (shine) {
        btn.enableShineEffect();
      } else {
        btn.disableShineEffect();
      }
    } catch {
      return;
    }

    const off = onClick
      ? (() => {
          try {
            return btn.onClick(() => {
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
        btn.hideLoader();
        btn.disableShineEffect();
        btn.hide();
        btn.unmount();
      } catch {
        // feature not available in current environment
      }
    };
  }, [enabled, loading, onClick, shine, text, visible]);
}