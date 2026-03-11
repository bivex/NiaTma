import { backButton, openLink, swipeBehavior } from '@tma.js/sdk-react';

export function showBackNavigation() {
  backButton.show();
}

export function hideBackNavigation() {
  backButton.hide();
}

export function onBackNavigation(callback: () => void) {
  return backButton.onClick(callback);
}

export function openExternalLink(url: string) {
  openLink(url);
}

export function mountSwipeBehavior() {
  swipeBehavior.mount();
}

export function unmountSwipeBehavior() {
  swipeBehavior.unmount();
}

export function enableVerticalSwipe() {
  swipeBehavior.enableVertical();
}

export function disableVerticalSwipe() {
  swipeBehavior.disableVertical();
}