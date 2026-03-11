'use client';

import { create } from 'zustand';

import type { PlatformNoticeId } from '../domain/models';
import { appConfig } from '@/shared/config/appConfig';

export interface PlatformStoreState {
  noticeId: PlatformNoticeId;
  showSkeleton: boolean;
  mainActionLoading: boolean;
  allowVerticalSwipe: boolean;
  setNotice: (noticeId: PlatformNoticeId) => void;
  startMainAction: () => void;
  finishMainAction: () => void;
  showSkeletonPreview: () => void;
  hideSkeletonPreview: () => void;
  toggleAllowVerticalSwipe: () => void;
  reset: () => void;
}

export function createInitialPlatformStoreState(
  allowVerticalSwipe = appConfig.features.verticalSwipeBehavior,
) {
  return {
    noticeId: 'idle' as const,
    showSkeleton: false,
    mainActionLoading: false,
    allowVerticalSwipe,
  };
}

const initialState = createInitialPlatformStoreState();

export const usePlatformStore = create<PlatformStoreState>()((set) => ({
  ...initialState,
  setNotice: (noticeId) => set({ noticeId }),
  startMainAction: () => set({ mainActionLoading: true, noticeId: 'mainButton' }),
  finishMainAction: () => set({ mainActionLoading: false }),
  showSkeletonPreview: () => set({ showSkeleton: true, noticeId: 'skeleton' }),
  hideSkeletonPreview: () => set({ showSkeleton: false }),
  toggleAllowVerticalSwipe: () =>
    set((state) => ({ allowVerticalSwipe: !state.allowVerticalSwipe })),
  reset: () => set(createInitialPlatformStoreState()),
}));