import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { ApiError } from '@/shared/lib/errors';
import { authApiService } from './authApi';
import type { AuthSessionStatus, AuthUserProfile } from '../domain/models';

class NetworkError extends Error {
  override name = 'NetworkError';
}

describe('requestAuth', () => {
  let nativeFetch: typeof fetch;

  beforeAll(() => {
    nativeFetch = globalThis.fetch;
  });

  afterAll(() => {
    globalThis.fetch = nativeFetch;
  });

  test('throws AuthError when fetch throws a network TypeError', async () => {
    globalThis.fetch = async () => {
      throw new NetworkError('Failed to fetch');
    };

    await expect(authApiService.fetchSession()).rejects.toThrow(ApiError);
    await expect(authApiService.fetchSession()).rejects.toThrow('Network error');
  });

  test('throws AuthError on non-ok HTTP response with server JSON message', async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ message: 'Session expired' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });

    await expect(authApiService.fetchSession()).rejects.toThrow('Session expired');
  });

  test('throws AuthError on non-ok HTTP response without body message', async () => {
    globalThis.fetch = async () =>
      new Response(null, {
        status: 503,
      });

    await expect(authApiService.fetchSession()).rejects.toThrow('Auth request failed: 503');
  });

  test('returns AuthSessionStatus on successful GET response', async () => {
    const sessionPayload = {
      status: 'anonymous' as const,
      capabilities: {
        telegramAuthAvailable: false,
        sessionSigningConfigured: false,
        devLoginAvailable: false,
      },
    };

    globalThis.fetch = async () =>
      new Response(JSON.stringify(sessionPayload), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });

    const result = (await authApiService.fetchSession()) as AuthSessionStatus;

    expect(result.status).toBe('anonymous');
    expect(result.capabilities.telegramAuthAvailable).toBe(false);
    expect(result.capabilities.sessionSigningConfigured).toBe(false);
    expect(result.capabilities.devLoginAvailable).toBe(false);
  });

  test('returns AuthUserProfile on successful profile GET response', async () => {
    const profilePayload = {
      subject: 'dev:local-preview',
      provider: 'dev' as const,
      userId: 'local-preview',
      displayName: 'Local Preview',
      username: 'dev',
      languageCode: 'en',
      issuedAt: 1_700_000_000_000,
      expiresAt: 1_700_086_400_000,
      wallet: undefined,
    };

    globalThis.fetch = async () =>
      new Response(JSON.stringify(profilePayload), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });

    const result = (await authApiService.fetchProfile()) as AuthUserProfile;

    expect(result.subject).toBe('dev:local-preview');
    expect(result.provider).toBe('dev');
    expect(result.userId).toBe('local-preview');
    expect(result.displayName).toBe('Local Preview');
    expect(result.username).toBe('dev');
  });

  test('send POST body as JSON with content-type header', async () => {
    const body = { initData: 'telegram_init_data_here' };
    let capturedInit: RequestInit | undefined;

    globalThis.fetch = async (_url: RequestInfo | URL, init?: RequestInit) => {
      capturedInit = init;
      return new Response(JSON.stringify({ status: 'authenticated' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    await authApiService.signInWithTelegram(body.initData);

    expect(capturedInit?.method).toBe('POST');
    expect(capturedInit?.body).toBe(JSON.stringify(body));
    const headers = capturedInit?.headers as Record<string, string> | undefined;
    expect(headers?.['content-type']).toBe('application/json');
  });

  test('throws AuthError on non-ok POST response', async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ message: 'Token verification failed' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });

    await expect(
      authApiService.verifyTonProofSession({ address: '0xabc', proof: {} } as any),
    ).rejects.toThrow('Token verification failed');
  });
});
