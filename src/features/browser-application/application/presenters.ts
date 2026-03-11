import type {
  BrowserApplicationScreenModel,
  BrowserApplicationSnapshot,
} from '../domain/models';

function formatStorageBytes(value?: number): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value < 1024) {
    return `${value} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let size = value / 1024;
  let unit = units[0];

  for (let index = 1; index < units.length && size >= 1024; index += 1) {
    size /= 1024;
    unit = units[index] || unit;
  }

  return `${size.toFixed(2)} ${unit}`;
}

export function buildBrowserApplicationScreenModel(
  snapshot: BrowserApplicationSnapshot,
): BrowserApplicationScreenModel {
  return {
    sections: [
      {
        id: 'application',
        rows: [
          { field: 'origin', value: { kind: 'text', text: snapshot.origin } },
          { field: 'manifest', value: { kind: 'link', href: snapshot.manifestUrl } },
          { field: 'displayMode', value: { kind: 'text', text: snapshot.displayMode } },
          { field: 'standalone', value: { kind: 'boolean', checked: snapshot.standalone } },
          { field: 'frameCount', value: { kind: 'text', text: String(snapshot.frameCount) } },
        ],
      },
      {
        id: 'serviceWorker',
        rows: [
          {
            field: 'serviceWorkerSupported',
            value: { kind: 'boolean', checked: snapshot.serviceWorkerSupported },
          },
          {
            field: 'serviceWorkerRegistered',
            value: { kind: 'boolean', checked: snapshot.serviceWorkerRegistered },
          },
          {
            field: 'serviceWorkerControlled',
            value: { kind: 'boolean', checked: snapshot.serviceWorkerControlled },
          },
          {
            field: 'serviceWorkerScope',
            value: { kind: 'text', text: snapshot.serviceWorkerScope },
          },
        ],
      },
      {
        id: 'storage',
        rows: [
          {
            field: 'localStorageSupported',
            value: { kind: 'boolean', checked: snapshot.localStorageSupported },
          },
          { field: 'localStorageDemo', value: { kind: 'boolean', checked: snapshot.localStorageDemo } },
          {
            field: 'sessionStorageSupported',
            value: { kind: 'boolean', checked: snapshot.sessionStorageSupported },
          },
          {
            field: 'sessionStorageDemo',
            value: { kind: 'boolean', checked: snapshot.sessionStorageDemo },
          },
          {
            field: 'indexedDbSupported',
            value: { kind: 'boolean', checked: snapshot.indexedDbSupported },
          },
          { field: 'indexedDbDemo', value: { kind: 'boolean', checked: snapshot.indexedDbDemo } },
          { field: 'cookiesEnabled', value: { kind: 'boolean', checked: snapshot.cookiesEnabled } },
          { field: 'cookieDemo', value: { kind: 'boolean', checked: snapshot.cookieDemo } },
          {
            field: 'cacheStorageSupported',
            value: { kind: 'boolean', checked: snapshot.cacheStorageSupported },
          },
          { field: 'cacheDemo', value: { kind: 'boolean', checked: snapshot.cacheDemo } },
          {
            field: 'storagePersistSupported',
            value: { kind: 'boolean', checked: snapshot.storagePersistSupported },
          },
          {
            field: 'storagePersisted',
            value: { kind: 'boolean', checked: Boolean(snapshot.storagePersisted) },
          },
          {
            field: 'storageQuota',
            value: { kind: 'text', text: formatStorageBytes(snapshot.storageQuota) },
          },
          {
            field: 'storageUsage',
            value: { kind: 'text', text: formatStorageBytes(snapshot.storageUsage) },
          },
        ],
      },
      {
        id: 'capabilities',
        rows: [
          {
            field: 'notificationPermission',
            value: { kind: 'text', text: snapshot.notificationPermission },
          },
          {
            field: 'pushMessagingSupported',
            value: { kind: 'boolean', checked: snapshot.pushMessagingSupported },
          },
          {
            field: 'backgroundSyncSupported',
            value: { kind: 'boolean', checked: snapshot.backgroundSyncSupported },
          },
          {
            field: 'periodicBackgroundSyncSupported',
            value: { kind: 'boolean', checked: snapshot.periodicBackgroundSyncSupported },
          },
          {
            field: 'paymentHandlerSupported',
            value: { kind: 'boolean', checked: snapshot.paymentHandlerSupported },
          },
          {
            field: 'reportingApiSupported',
            value: { kind: 'boolean', checked: snapshot.reportingApiSupported },
          },
          {
            field: 'privateStateTokensSupported',
            value: { kind: 'boolean', checked: snapshot.privateStateTokensSupported },
          },
          {
            field: 'interestGroupsSupported',
            value: { kind: 'boolean', checked: snapshot.interestGroupsSupported },
          },
          {
            field: 'sharedStorage',
            value: { kind: 'text', text: snapshot.sharedStorage },
          },
          {
            field: 'storageBucketsSupported',
            value: { kind: 'boolean', checked: snapshot.storageBucketsSupported },
          },
          {
            field: 'speculativeLoadsSupported',
            value: { kind: 'boolean', checked: snapshot.speculativeLoadsSupported },
          },
          {
            field: 'backgroundFetchSupported',
            value: { kind: 'boolean', checked: snapshot.backgroundFetchSupported },
          },
        ],
      },
      {
        id: 'browserManaged',
        rows: [
          { field: 'backForwardCache', value: { kind: 'text', text: snapshot.backForwardCache } },
          {
            field: 'bounceTrackingMitigations',
            value: { kind: 'text', text: snapshot.bounceTrackingMitigations },
          },
          {
            field: 'backgroundServices',
            value: { kind: 'text', text: snapshot.backgroundServices },
          },
        ],
      },
    ],
  };
}

export { formatStorageBytes };