'use client';

import type { BrowserApplicationSnapshot } from '../domain/models';

const CACHE_NAME = 'application-capabilities-demo';
const CACHE_REQUEST_URL = '/__application-demo__';
const COOKIE_NAME = 'application_demo';
const INDEXED_DB_NAME = 'application-capabilities';
const INDEXED_DB_STORE = 'entries';
const INDEXED_DB_KEY = 'demo';
const LOCAL_STORAGE_KEY = 'application.demo.local';
const SESSION_STORAGE_KEY = 'application.demo.session';

const hasWindowFeature = (name: string) => typeof window !== 'undefined' && name in window;
const hasNavigatorFeature = (name: string) => typeof navigator !== 'undefined' && name in navigator;

const canUseStorage = (storage: Storage | undefined) => {
  try {
    if (!storage) return false;
    const key = '__application_probe__';
    storage.setItem(key, key);
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const getDisplayMode = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'browser';
  for (const mode of ['fullscreen', 'standalone', 'minimal-ui']) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) return mode;
  }
  return 'browser';
};

const wrapIdbRequest = <T>(
  request: IDBRequest<T>,
): Promise<T> =>
  new Promise<T>((settle, err) => {
    request.onsuccess = () => settle(request.result);
    request.onerror = () => err(request.error);
  });

const awaitTransactionComplete = (transaction: IDBTransaction, database: IDBDatabase): Promise<void> =>
  new Promise<void>((resolve) => {
    transaction.oncomplete = () => { database.close(); resolve(); };
  });

const openIndexedDb = () =>
  new Promise<IDBDatabase>((onFulfill, onReject) => {
    const request = indexedDB.open(INDEXED_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(INDEXED_DB_STORE)) {
        database.createObjectStore(INDEXED_DB_STORE);
      }
    };
    request.onsuccess = () => onFulfill(request.result);
    request.onerror = () => onReject(request.error);
  });

const hasIndexedDbDemo = async () => {
  if (!hasWindowFeature('indexedDB')) return false;
  try {
    const database = await openIndexedDb();
    const transaction = database.transaction(INDEXED_DB_STORE, 'readonly');
    const request = transaction.objectStore(INDEXED_DB_STORE).get(INDEXED_DB_KEY);
    const record = await wrapIdbRequest(request);
    database.close();
    return record !== undefined;
  } catch {
    return false;
  }
};

const inIdbWrite = <T>(
  database: IDBDatabase,
  writeFn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<void> => {
  const transaction = database.transaction(INDEXED_DB_STORE, 'readwrite');
  const request = writeFn(transaction.objectStore(INDEXED_DB_STORE));
  return new Promise<void>((fulfill, reject) => {
    request.onsuccess = () => fulfill(request.result as void | PromiseLike<void>);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => { database.close(); fulfill(); };
  });
};

const writeIndexedDbDemo = async () => {
  if (!hasWindowFeature('indexedDB')) return;
  const database = await openIndexedDb();
  await inIdbWrite(database, (store) =>
    store.put({ createdAt: new Date().toISOString(), source: 'application-screen' }, INDEXED_DB_KEY),
  );
};

const clearIndexedDbDemo = async () => {
  if (!hasWindowFeature('indexedDB')) return;
  const database = await openIndexedDb();
  await inIdbWrite(database, (store) => store.delete(INDEXED_DB_KEY));
};

const getApplicationServiceWorkerRegistration = async () => {
  if (!hasNavigatorFeature('serviceWorker')) return undefined;
  const registrations = await navigator.serviceWorker.getRegistrations();
  return registrations.find((registration) =>
    [registration.active, registration.installing, registration.waiting].some((worker) =>
      worker?.scriptURL.includes('/app-sw.js'),
    ),
  );
};

export const browserAppService = {
  readSnapshot: async (): Promise<BrowserApplicationSnapshot> => {
    const localStorageSupported = canUseStorage(globalThis.localStorage);
    const sessionStorageSupported = canUseStorage(globalThis.sessionStorage);
    const cacheStorageSupported = hasWindowFeature('caches');
    const registration = await getApplicationServiceWorkerRegistration();
    const storageEstimate = await navigator.storage?.estimate?.();
    const storagePersisted = await navigator.storage?.persisted?.();
    const displayMode = getDisplayMode();

    return {
      origin: globalThis.location?.origin || '',
      manifestUrl: '/manifest.webmanifest',
      displayMode,
      standalone:
        displayMode === 'standalone' ||
        (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches),
      frameCount: typeof window !== 'undefined' ? window.frames.length : 0,
      serviceWorkerSupported: hasNavigatorFeature('serviceWorker'),
      serviceWorkerRegistered: Boolean(registration),
      serviceWorkerControlled: Boolean(navigator.serviceWorker?.controller),
      serviceWorkerScope: registration?.scope,
      localStorageSupported,
      localStorageDemo: localStorageSupported && localStorage.getItem(LOCAL_STORAGE_KEY) !== null,
      sessionStorageSupported,
      sessionStorageDemo: sessionStorageSupported && sessionStorage.getItem(SESSION_STORAGE_KEY) !== null,
      indexedDbSupported: hasWindowFeature('indexedDB'),
      indexedDbDemo: await hasIndexedDbDemo(),
      cookiesEnabled: navigator.cookieEnabled,
      cookieDemo: document.cookie.includes(`${COOKIE_NAME}=`),
      cacheStorageSupported,
      cacheDemo: cacheStorageSupported && (await caches.keys()).includes(CACHE_NAME),
      storagePersistSupported: Boolean(navigator.storage?.persist),
      storagePersisted,
      storageQuota: storageEstimate?.quota,
      storageUsage: storageEstimate?.usage,
      notificationPermission: hasWindowFeature('Notification') ? Notification.permission : 'unsupported',
      pushMessagingSupported: hasWindowFeature('PushManager'),
      backgroundSyncSupported:
        hasWindowFeature('SyncManager') && (registration ? 'sync' in registration : true),
      periodicBackgroundSyncSupported: Boolean(registration && 'periodicSync' in registration),
      paymentHandlerSupported: hasWindowFeature('PaymentRequest'),
      reportingApiSupported: hasWindowFeature('ReportingObserver'),
      privateStateTokensSupported: 'hasPrivateToken' in document,
      interestGroupsSupported:
        hasNavigatorFeature('joinAdInterestGroup') || hasNavigatorFeature('runAdAuction'),
      sharedStorage:
        'Inspect manually in a compatible Chromium build. Runtime probing is skipped to avoid deprecated API usage.',
      storageBucketsSupported: hasNavigatorFeature('storageBuckets'),
      speculativeLoadsSupported:
        typeof HTMLScriptElement !== 'undefined' &&
        typeof HTMLScriptElement.supports === 'function' &&
        HTMLScriptElement.supports('speculationrules'),
      backgroundFetchSupported: hasWindowFeature('BackgroundFetchManager'),
      backForwardCache: 'Inspect after using browser back/forward navigation.',
      bounceTrackingMitigations: 'Browser-managed and not configurable from app code.',
      backgroundServices: 'Driven by service workers, notifications, and push integrations.',
    };
  },

  registerServiceWorker: async () => {
    if (!hasNavigatorFeature('serviceWorker')) return false;
    await navigator.serviceWorker.register('/app-sw.js', { scope: '/' });
    return true;
  },

  unregisterServiceWorker: async () => {
    if (!hasNavigatorFeature('serviceWorker')) return false;
    const registration = await getApplicationServiceWorkerRegistration();
    return registration ? registration.unregister() : false;
  },

  seedDemoData: async () => {
    if (canUseStorage(globalThis.localStorage)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toISOString());
    }
    if (canUseStorage(globalThis.sessionStorage)) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, new Date().toISOString());
    }
    if (navigator.cookieEnabled) {
      document.cookie = `${COOKIE_NAME}=1; path=/; max-age=86400; samesite=lax`;
    }
    await writeIndexedDbDemo();
    if (hasWindowFeature('caches')) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(
        CACHE_REQUEST_URL,
        new Response(JSON.stringify({ createdAt: new Date().toISOString() }), {
          headers: { 'content-type': 'application/json' },
        }),
      );
    }
  },

  clearDemoData: async () => {
    if (canUseStorage(globalThis.localStorage)) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    if (canUseStorage(globalThis.sessionStorage)) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
    await clearIndexedDbDemo();
    if (hasWindowFeature('caches')) {
      await caches.delete(CACHE_NAME);
    }
  },

  requestNotificationPermission: async () => {
    if (!hasWindowFeature('Notification')) return false;
    await Notification.requestPermission();
    return true;
  },

  requestStoragePersistence: async () => {
    const persist = navigator.storage?.persist;
    if (!persist) return false;
    await persist.call(navigator.storage);
    return true;
  },

  registerBackgroundSync: async () => {
    const registration = await getApplicationServiceWorkerRegistration();
    if (!registration || !('sync' in registration)) return false;
    const syncRegistration = registration as ServiceWorkerRegistration & {
      sync?: { register(tag: string): Promise<void> };
    };
    if (!syncRegistration.sync) return false;
    await syncRegistration.sync.register('application-capabilities-demo-sync');
    return true;
  },
};
