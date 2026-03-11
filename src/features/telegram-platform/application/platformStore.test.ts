import { beforeEach, describe, expect, test } from 'bun:test';

import { createInitialPlatformStoreState, usePlatformStore } from './platformStore';

describe('platformStore', () => {
  beforeEach(() => {
    usePlatformStore.getState().reset();
  });

  test('uses expected initial state', () => {
    expect(createInitialPlatformStoreState(true)).toEqual({
      noticeId: 'idle',
      showSkeleton: false,
      mainActionLoading: false,
      allowVerticalSwipe: true,
    });
  });

  test('updates loading, skeleton and swipe flags through actions', () => {
    const store = usePlatformStore.getState();

    store.startMainAction();
    expect(usePlatformStore.getState().mainActionLoading).toBe(true);
    expect(usePlatformStore.getState().noticeId).toBe('mainButton');

    usePlatformStore.getState().finishMainAction();
    usePlatformStore.getState().showSkeletonPreview();
    usePlatformStore.getState().toggleAllowVerticalSwipe();

    expect(usePlatformStore.getState().mainActionLoading).toBe(false);
    expect(usePlatformStore.getState().showSkeleton).toBe(true);
    expect(usePlatformStore.getState().allowVerticalSwipe).toBe(false);
  });
});