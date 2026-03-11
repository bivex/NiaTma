import { describe, expect, test } from 'bun:test';

import {
  mapPlatformServerStateDto,
  platformServerStateQueryKey,
} from './platformServerState';

describe('platformServerState', () => {
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
});