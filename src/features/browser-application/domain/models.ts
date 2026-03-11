import type { DisplayDataValue } from '@/shared/domain/display-data';

export type BrowserApplicationSectionId =
  | 'application'
  | 'serviceWorker'
  | 'storage'
  | 'capabilities'
  | 'browserManaged';

export type BrowserApplicationFieldId =
  | 'origin'
  | 'manifest'
  | 'displayMode'
  | 'standalone'
  | 'frameCount'
  | 'serviceWorkerSupported'
  | 'serviceWorkerRegistered'
  | 'serviceWorkerControlled'
  | 'serviceWorkerScope'
  | 'localStorageSupported'
  | 'localStorageDemo'
  | 'sessionStorageSupported'
  | 'sessionStorageDemo'
  | 'indexedDbSupported'
  | 'indexedDbDemo'
  | 'cookiesEnabled'
  | 'cookieDemo'
  | 'cacheStorageSupported'
  | 'cacheDemo'
  | 'storagePersistSupported'
  | 'storagePersisted'
  | 'storageQuota'
  | 'storageUsage'
  | 'notificationPermission'
  | 'pushMessagingSupported'
  | 'backgroundSyncSupported'
  | 'periodicBackgroundSyncSupported'
  | 'paymentHandlerSupported'
  | 'reportingApiSupported'
  | 'privateStateTokensSupported'
  | 'interestGroupsSupported'
  | 'sharedStorage'
  | 'storageBucketsSupported'
  | 'speculativeLoadsSupported'
  | 'backgroundFetchSupported'
  | 'backForwardCache'
  | 'bounceTrackingMitigations'
  | 'backgroundServices';

export interface BrowserApplicationRow {
  field: BrowserApplicationFieldId;
  value: DisplayDataValue;
}

export interface BrowserApplicationSection {
  id: BrowserApplicationSectionId;
  rows: BrowserApplicationRow[];
}

export interface BrowserApplicationScreenModel {
  sections: BrowserApplicationSection[];
}

export interface BrowserApplicationSnapshot {
  origin: string;
  manifestUrl: string;
  displayMode: string;
  standalone: boolean;
  frameCount: number;
  serviceWorkerSupported: boolean;
  serviceWorkerRegistered: boolean;
  serviceWorkerControlled: boolean;
  serviceWorkerScope?: string;
  localStorageSupported: boolean;
  localStorageDemo: boolean;
  sessionStorageSupported: boolean;
  sessionStorageDemo: boolean;
  indexedDbSupported: boolean;
  indexedDbDemo: boolean;
  cookiesEnabled: boolean;
  cookieDemo: boolean;
  cacheStorageSupported: boolean;
  cacheDemo: boolean;
  storagePersistSupported: boolean;
  storagePersisted?: boolean;
  storageQuota?: number;
  storageUsage?: number;
  notificationPermission: string;
  pushMessagingSupported: boolean;
  backgroundSyncSupported: boolean;
  periodicBackgroundSyncSupported: boolean;
  paymentHandlerSupported: boolean;
  reportingApiSupported: boolean;
  privateStateTokensSupported: boolean;
  interestGroupsSupported: boolean;
  sharedStorage: string;
  storageBucketsSupported: boolean;
  speculativeLoadsSupported: boolean;
  backgroundFetchSupported: boolean;
  backForwardCache: string;
  bounceTrackingMitigations: string;
  backgroundServices: string;
}

export type BrowserApplicationActionId =
  | 'refresh'
  | 'registerServiceWorker'
  | 'unregisterServiceWorker'
  | 'seedDemoData'
  | 'clearDemoData'
  | 'requestNotifications'
  | 'requestPersistence'
  | 'registerBackgroundSync';

export type BrowserApplicationNoticeId =
  | 'idle'
  | 'refreshed'
  | 'serviceWorkerRegistered'
  | 'serviceWorkerUnregistered'
  | 'demoDataSeeded'
  | 'demoDataCleared'
  | 'notificationPermissionUpdated'
  | 'storagePersistenceUpdated'
  | 'backgroundSyncRegistered'
  | 'unsupported'
  | 'error';