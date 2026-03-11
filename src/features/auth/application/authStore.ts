'use client';

import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type { AuthSessionStatus, AuthUserProfile } from '../domain/models';
import { toAuthUserProfile } from './profile';

const emptyStorage: StateStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

function getAuthPersistStorage(): StateStorage {
  return typeof window === 'undefined' ? emptyStorage : localStorage;
}

export function sanitizePersistedAuthSessionStatus(
  status?: AuthSessionStatus,
  now = Date.now(),
): AuthSessionStatus | undefined {
  if (!status) return undefined;
  if (status.status !== 'authenticated' || !status.session) return { ...status, session: undefined };
  return status.session.expiresAt > now ? status : { status: 'anonymous', capabilities: status.capabilities };
}

export function sanitizePersistedAuthProfile(profile?: AuthUserProfile, now = Date.now()): AuthUserProfile | undefined {
  return profile && profile.expiresAt > now ? profile : undefined;
}

function deriveProfile(status?: AuthSessionStatus) {
  const activeStatus = sanitizePersistedAuthSessionStatus(status);
  return activeStatus?.status === 'authenticated' && activeStatus.session
    ? sanitizePersistedAuthProfile(toAuthUserProfile(activeStatus.session))
    : undefined;
}

interface AuthStoreState {
  sessionStatus?: AuthSessionStatus;
  profile?: AuthUserProfile;
  syncSessionStatus: (status: AuthSessionStatus) => void;
  syncProfile: (profile?: AuthUserProfile) => void;
  clear: () => void;
}

const initialState = { sessionStatus: undefined, profile: undefined };

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      ...initialState,
      syncSessionStatus: (status) =>
        set(() => {
          const sessionStatus = sanitizePersistedAuthSessionStatus(status);
          return { sessionStatus, profile: deriveProfile(sessionStatus) };
        }),
      syncProfile: (profile) => set(() => ({ profile: sanitizePersistedAuthProfile(profile) })),
      clear: () => set(initialState),
    }),
    {
      name: 'nia.auth.store',
      storage: createJSONStorage(getAuthPersistStorage),
      partialize: (state) => ({ sessionStatus: state.sessionStatus, profile: state.profile }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AuthStoreState>;
        return {
          ...currentState,
          sessionStatus: sanitizePersistedAuthSessionStatus(persisted.sessionStatus),
          profile: sanitizePersistedAuthProfile(persisted.profile) ?? deriveProfile(persisted.sessionStatus),
        };
      },
    },
  ),
);