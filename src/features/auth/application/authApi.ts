import { ApiError } from '@/shared/lib/errors';
import type {
  AuthLinkedWalletInput,
  AuthSessionStatus,
  AuthTonProofPayload,
  AuthUserProfile,
  VerifyAuthTonProofInput,
} from '../domain/models';

export const authSessionQueryKey = ['auth', 'session'] as const;
export const authProfileQueryKey = ['auth', 'profile'] as const;
export const authTonProofPayloadQueryKey = ['auth', 'ton-proof', 'payload'] as const;

export class AuthError extends ApiError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = 'AuthError';
  }
}

async function requestAuth<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    cache: 'no-store',
    credentials: 'same-origin',
    headers: {
      accept: 'application/json',
      ...(init?.body ? { 'content-type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => undefined)) as { message?: string } | undefined;

  if (!response.ok) {
    throw new AuthError(payload?.message || `Auth request failed: ${response.status}`, response.status);
  }

  return payload as T;
}

export const authApiService = {
  fetchSession: () => requestAuth<AuthSessionStatus>('/api/auth/session'),
  fetchProfile: () => requestAuth<AuthUserProfile>('/api/auth/profile'),
  signInWithTelegram: (initData: string) =>
    requestAuth<AuthSessionStatus>('/api/auth/telegram', {
      method: 'POST',
      body: JSON.stringify({ initData }),
    }),
  signInWithDevLogin: () =>
    requestAuth<AuthSessionStatus>('/api/auth/dev-login', {
      method: 'POST',
    }),
  logoutSession: () =>
    requestAuth<AuthSessionStatus>('/api/auth/logout', {
      method: 'POST',
    }),
  linkWallet: (wallet: AuthLinkedWalletInput) =>
    requestAuth<AuthSessionStatus>('/api/auth/wallet', {
      method: 'POST',
      body: JSON.stringify(wallet),
    }),
  unlinkWallet: () =>
    requestAuth<AuthSessionStatus>('/api/auth/wallet', {
      method: 'DELETE',
    }),
  fetchTonProofPayload: () => requestAuth<AuthTonProofPayload>('/api/auth/ton-proof/payload'),
  verifyTonProofSession: (input: VerifyAuthTonProofInput) =>
    requestAuth<AuthSessionStatus>('/api/auth/ton-proof/verify', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
};
