import { describe, expect, test } from 'bun:test';

import { buildBrowserApplicationScreenModel, formatStorageBytes } from './presenters';

describe('browser-application presenters', () => {
  test('formats storage values for display', () => {
    expect(formatStorageBytes(512)).toBe('512 B');
    expect(formatStorageBytes(2048)).toBe('2.00 KB');
    expect(formatStorageBytes(5 * 1024 * 1024)).toBe('5.00 MB');
  });

  test('builds manifest and storage rows from snapshot', () => {
    const screen = buildBrowserApplicationScreenModel({
      origin: 'http://localhost:3000',
      manifestUrl: '/manifest.webmanifest',
      displayMode: 'browser',
      standalone: false,
      frameCount: 1,
      serviceWorkerSupported: true,
      serviceWorkerRegistered: true,
      serviceWorkerControlled: false,
      serviceWorkerScope: '/',
      localStorageSupported: true,
      localStorageDemo: true,
      sessionStorageSupported: true,
      sessionStorageDemo: true,
      indexedDbSupported: true,
      indexedDbDemo: true,
      cookiesEnabled: true,
      cookieDemo: true,
      cacheStorageSupported: true,
      cacheDemo: true,
      storagePersistSupported: true,
      storagePersisted: false,
      storageQuota: 2 * 1024 * 1024,
      storageUsage: 1024,
      notificationPermission: 'default',
      pushMessagingSupported: false,
      backgroundSyncSupported: true,
      periodicBackgroundSyncSupported: false,
      paymentHandlerSupported: true,
      reportingApiSupported: true,
      privateStateTokensSupported: false,
      interestGroupsSupported: false,
      sharedStorage: 'Inspect manually in a compatible Chromium build.',
      storageBucketsSupported: false,
      speculativeLoadsSupported: true,
      backgroundFetchSupported: false,
      backForwardCache: 'Inspect after using browser back/forward navigation.',
      bounceTrackingMitigations: 'Browser-managed.',
      backgroundServices: 'Driven by service worker APIs.',
    });

    expect(screen.sections[0]?.rows[1]).toEqual({
      field: 'manifest',
      value: { kind: 'link', href: '/manifest.webmanifest' },
    });
    expect(screen.sections[2]?.rows[12]).toEqual({
      field: 'storageQuota',
      value: { kind: 'text', text: '2.00 MB' },
    });
    expect(screen.sections[3]?.rows[2]).toEqual({
      field: 'backgroundSyncSupported',
      value: { kind: 'boolean', checked: true },
    });
  });
});