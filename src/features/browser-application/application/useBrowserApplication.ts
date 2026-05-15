'use client';

import { useCallback, useEffect, useState } from 'react';

import type {
  BrowserApplicationActionId,
  BrowserApplicationNoticeId,
  BrowserApplicationSnapshot,
} from '../domain/models';
import { buildBrowserApplicationScreenModel } from './presenters';
import { browserAppService } from '../infrastructure/browser';

export function useBrowserApplication() {
  const [snapshot, setSnapshot] = useState<BrowserApplicationSnapshot | null>(null);
  const [noticeId, setNoticeId] = useState<BrowserApplicationNoticeId>('idle');
  const [pendingAction, setPendingAction] = useState<BrowserApplicationActionId | null>(null);

  const loadSnapshot = useCallback(async () => {
    const nextSnapshot = await browserAppService.readSnapshot();
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
      runAction('registerServiceWorker', browserAppService.registerServiceWorker, 'serviceWorkerRegistered'),
    unregisterServiceWorker: () =>
      runAction(
        'unregisterServiceWorker',
        browserAppService.unregisterServiceWorker,
        'serviceWorkerUnregistered',
      ),
    seedDemoData: () => runAction('seedDemoData', browserAppService.seedDemoData, 'demoDataSeeded'),
    clearDemoData: () =>
      runAction('clearDemoData', browserAppService.clearDemoData, 'demoDataCleared'),
    requestNotifications: () =>
      runAction(
        'requestNotifications',
        browserAppService.requestNotificationPermission,
        'notificationPermissionUpdated',
      ),
    requestPersistence: () =>
      runAction(
        'requestPersistence',
        browserAppService.requestStoragePersistence,
        'storagePersistenceUpdated',
      ),
    registerBackgroundSync: () =>
      runAction(
        'registerBackgroundSync',
        browserAppService.registerBackgroundSync,
        'backgroundSyncRegistered',
      ),
  };
}
