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

function hasWindowFeature(name: string) {
  return typeof window !== 'undefined' && name in window;
}

function hasNavigatorFeature(name: string) {
  return typeof navigator !== 'undefined' && name in navigator;
}

function canUseStorage(storage: Storage | undefined) {
  try {
    if (!storage) {
      return false;
    }

    const key = '__application_probe__';
    storage.setItem(key, key);
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function getDisplayMode() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'browser';
  }

  for (const mode of ['fullscreen', 'standalone', 'minimal-ui']) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) {
      return mode;
    }
  }

  return 'browser';
}

function openIndexedDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(INDEXED_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(INDEXED_DB_STORE)) {
        database.createObjectStore(INDEXED_DB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function hasIndexedDbDemo() {
  if (!hasWindowFeature('indexedDB')) {
    return false;
  }

  try {
    const database = await openIndexedDb();

    const result = await new Promise<boolean>((resolve, reject) => {
      const transaction = database.transaction(INDEXED_DB_STORE, 'readonly');
      const store = transaction.objectStore(INDEXED_DB_STORE);
      const request = store.get(INDEXED_DB_KEY);

      request.onsuccess = () => resolve(request.result !== undefined);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => database.close();
    });

    return result;
  } catch {
    return false;
  }
}

async function writeIndexedDbDemo() {
  if (!hasWindowFeature('indexedDB')) {
    return;
  }

  const database = await openIndexedDb();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(INDEXED_DB_STORE, 'readwrite');
    transaction.objectStore(INDEXED_DB_STORE).put(
      { createdAt: new Date().toISOString(), source: 'application-screen' },
      INDEXED_DB_KEY,
    );

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

async function clearIndexedDbDemo() {
  if (!hasWindowFeature('indexedDB')) {
    return;
  }

  const database = await openIndexedDb();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(INDEXED_DB_STORE, 'readwrite');
    transaction.objectStore(INDEXED_DB_STORE).delete(INDEXED_DB_KEY);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getApplicationServiceWorkerRegistration() {
  if (!hasNavigatorFeature('serviceWorker')) {
    return undefined;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();

  return registrations.find((registration) =>
    [registration.active, registration.installing, registration.waiting].some((worker) =>
      worker?.scriptURL.includes('/app-sw.js'),
    ),
  );
}

export async function readBrowserApplicationSnapshot(): Promise<BrowserApplicationSnapshot> {
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
}

export async function registerApplicationServiceWorker() {
  if (!hasNavigatorFeature('serviceWorker')) {
    return false;
  }

  await navigator.serviceWorker.register('/app-sw.js', { scope: '/' });
  return true;
}

export async function unregisterApplicationServiceWorker() {
  if (!hasNavigatorFeature('serviceWorker')) {
    return false;
  }

  const registration = await getApplicationServiceWorkerRegistration();
  return registration ? registration.unregister() : false;
}

export async function seedBrowserApplicationDemoData() {
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
}

export async function clearBrowserApplicationDemoData() {
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
}

export async function requestBrowserNotificationPermission() {
  if (!hasWindowFeature('Notification')) {
    return false;
  }

  await Notification.requestPermission();
  return true;
}

export async function requestBrowserStoragePersistence() {
  const persist = navigator.storage?.persist;
  if (!persist) {
    return false;
  }

  await persist.call(navigator.storage);
  return true;
}

export async function registerBrowserBackgroundSync() {
  const registration = await getApplicationServiceWorkerRegistration();
  if (!registration || !('sync' in registration)) {
    return false;
  }

  const syncRegistration = registration as ServiceWorkerRegistration & {
    sync?: { register(tag: string): Promise<void> };
  };

  if (!syncRegistration.sync) {
    return false;
  }

  await syncRegistration.sync.register('application-capabilities-demo-sync');
  return true;
}