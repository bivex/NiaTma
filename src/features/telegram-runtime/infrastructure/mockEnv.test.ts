import { describe, expect, test } from 'bun:test';

import { isLocalPreviewHost } from './mockEnv';

describe('telegram runtime mock host detection', () => {
  test('accepts loopback and local network preview hosts', () => {
    expect(isLocalPreviewHost('localhost')).toBe(true);
    expect(isLocalPreviewHost('127.0.0.1')).toBe(true);
    expect(isLocalPreviewHost('192.168.3.31')).toBe(true);
    expect(isLocalPreviewHost('10.0.0.5')).toBe(true);
    expect(isLocalPreviewHost('172.16.0.2')).toBe(true);
    expect(isLocalPreviewHost('app.local')).toBe(true);
  });

  test('rejects non-local hosts', () => {
    expect(isLocalPreviewHost('example.com')).toBe(false);
    expect(isLocalPreviewHost('staging.internal.example.com')).toBe(false);
    expect(isLocalPreviewHost('8.8.8.8')).toBe(false);
  });
});