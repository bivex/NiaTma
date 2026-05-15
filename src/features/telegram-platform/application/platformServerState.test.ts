import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { ApiError } from '@/shared/lib/errors';
import { mapPlatformServerStateDto, platformServerStateQueryKey } from './platformServerState';
import { fetchPlatformServerState } from './platformServerState';

class NetworkError extends Error {
  override name = 'NetworkError';
}

describe('platformServerState', () => {
  let nativeFetch: typeof fetch;

  beforeAll(() => {
    nativeFetch = globalThis.fetch;
  });

  afterAll(() => {
    globalThis.fetch = nativeFetch;
  });

  test('maps dto into server state model', () => {
    expect(
      mapPlatformServerStateDto({
        appName: 'NiaTma',
        serverTime: '2026-03-11T10:00:00.000Z',
        runtime: 'node v22.0.0',
        path: '/api/platform-demo',
      }),
    ).toEqual({
      appName: 'NiaTma',
      serverTime: '2026-03-11T10:00:00.000Z',
      runtime: 'node v22.0.0',
      path: '/api/platform-demo',
    });
  });

  test('exposes stable query key', () => {
    expect(platformServerStateQueryKey).toEqual(['platform', 'server-state']);
  });

  test('throws ApiError when fetch throws a network TypeError', async () => {
    globalThis.fetch = async () => {
      throw new NetworkError('Failed to fetch');
    };

    await expect(fetchPlatformServerState()).rejects.toThrow(ApiError);
    await expect(fetchPlatformServerState()).rejects.toThrow('Network error');
  });

  test('throws ApiError when the response is not ok', async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ message: 'Server error' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });

    await expect(fetchPlatformServerState()).rejects.toThrow(ApiError);
    await expect(fetchPlatformServerState()).rejects.toThrow('500');
  });

  test('returns mapped PlatformServerState on successful response', async () => {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          appName: 'NiaTma',
          serverTime: '2026-05-15T12:00:00.000Z',
          runtime: 'node v22.0.0',
          path: '/api/platform-demo',
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      );

    const result = await fetchPlatformServerState();

    expect(result).toEqual({
      appName: 'NiaTma',
      serverTime: '2026-05-15T12:00:00.000Z',
      runtime: 'node v22.0.0',
      path: '/api/platform-demo',
    });
  });
});
