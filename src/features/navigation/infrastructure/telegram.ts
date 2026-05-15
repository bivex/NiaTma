import { backButton, openLink, swipeBehavior } from '@tma.js/sdk-react';

export const telegramNavigationService = {
  showBack: () => {
    backButton.show();
  },
  hideBack: () => {
    backButton.hide();
  },
  onBack: (callback: () => void) => {
    return backButton.onClick(callback);
  },
  openExternalLink: (url: string) => {
    openLink(url);
  },
};

export const telegramSwipeService = {
  mount: () => {
    swipeBehavior.mount();
  },
  unmount: () => {
    swipeBehavior.unmount();
  },
  enableVertical: () => {
    swipeBehavior.enableVertical();
  },
  disableVertical: () => {
    swipeBehavior.disableVertical();
  },
};
