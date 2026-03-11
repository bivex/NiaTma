'use client';

import { useCallback, useEffect, useState } from 'react';

import type {
  BrowserApplicationActionId,
  BrowserApplicationNoticeId,
  BrowserApplicationSnapshot,
} from '../domain/models';
import { buildBrowserApplicationScreenModel } from './presenters';
import {
  clearBrowserApplicationDemoData,
  readBrowserApplicationSnapshot,
  registerApplicationServiceWorker,
  registerBrowserBackgroundSync,
  requestBrowserNotificationPermission,
  requestBrowserStoragePersistence,
  seedBrowserApplicationDemoData,
  unregisterApplicationServiceWorker,
} from '../infrastructure/browser';

export function useBrowserApplication() {
  const [snapshot, setSnapshot] = useState<BrowserApplicationSnapshot | null>(null);
  const [noticeId, setNoticeId] = useState<BrowserApplicationNoticeId>('idle');
  const [pendingAction, setPendingAction] = useState<BrowserApplicationActionId | null>(null);

  const loadSnapshot = useCallback(async () => {
    const nextSnapshot = await readBrowserApplicationSnapshot();
    setSnapshot(nextSnapshot);
    return nextSnapshot;
  }, []);

  useEffect(() => {
    void loadSnapshot().catch(() => {
      setNoticeId('error');
    });
  }, [loadSnapshot]);

  const runAction = useCallback(
    async (
      actionId: BrowserApplicationActionId,
      effect: () => Promise<boolean | void>,
      successNoticeId: BrowserApplicationNoticeId,
    ) => {
      setPendingAction(actionId);
      try {
        const result = await effect();
        await loadSnapshot();
        setNoticeId(result === false ? 'unsupported' : successNoticeId);
      } catch {
        setNoticeId('error');
      } finally {
        setPendingAction(null);
      }
    },
    [loadSnapshot],
  );

  return {
    screen: snapshot ? buildBrowserApplicationScreenModel(snapshot) : null,
    snapshot,
    noticeId,
    pendingAction,
    refresh: () => runAction('refresh', async () => void (await loadSnapshot()), 'refreshed'),
    registerServiceWorker: () =>
      runAction('registerServiceWorker', registerApplicationServiceWorker, 'serviceWorkerRegistered'),
    unregisterServiceWorker: () =>
      runAction(
        'unregisterServiceWorker',
        unregisterApplicationServiceWorker,
        'serviceWorkerUnregistered',
      ),
    seedDemoData: () => runAction('seedDemoData', seedBrowserApplicationDemoData, 'demoDataSeeded'),
    clearDemoData: () =>
      runAction('clearDemoData', clearBrowserApplicationDemoData, 'demoDataCleared'),
    requestNotifications: () =>
      runAction(
        'requestNotifications',
        requestBrowserNotificationPermission,
        'notificationPermissionUpdated',
      ),
    requestPersistence: () =>
      runAction(
        'requestPersistence',
        requestBrowserStoragePersistence,
        'storagePersistenceUpdated',
      ),
    registerBackgroundSync: () =>
      runAction(
        'registerBackgroundSync',
        registerBrowserBackgroundSync,
        'backgroundSyncRegistered',
      ),
  };
}