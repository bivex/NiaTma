import type { AuthLinkedWalletInput, AuthSessionStatus, AuthUserProfile } from '../domain/models';

export const authSessionQueryKey = ['auth', 'session'] as const;
export const authProfileQueryKey = ['auth', 'profile'] as const;

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
    throw new Error(payload?.message || `Auth request failed: ${response.status}`);
  }

  return payload as T;
}

export function fetchAuthSession() {
  return requestAuth<AuthSessionStatus>('/api/auth/session');
}

export function fetchAuthProfile() {
  return requestAuth<AuthUserProfile>('/api/auth/profile');
}

export function signInWithTelegram(initData: string) {
  return requestAuth<AuthSessionStatus>('/api/auth/telegram', {
    method: 'POST',
    body: JSON.stringify({ initData }),
  });
}

export function signInWithDevLogin() {
  return requestAuth<AuthSessionStatus>('/api/auth/dev-login', {
    method: 'POST',
  });
}

export function logoutAuthSession() {
  return requestAuth<AuthSessionStatus>('/api/auth/logout', {
    method: 'POST',
  });
}

export function linkAuthWallet(wallet: AuthLinkedWalletInput) {
  return requestAuth<AuthSessionStatus>('/api/auth/wallet', {
    method: 'POST',
    body: JSON.stringify(wallet),
  });
}

export function unlinkAuthWallet() {
  return requestAuth<AuthSessionStatus>('/api/auth/wallet', {
    method: 'DELETE',
  });
}