import { backButton, openLink } from '@tma.js/sdk-react';

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