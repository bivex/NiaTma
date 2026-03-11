import { describe, expect, test } from 'bun:test';

import { shouldInitEruda } from './init';

describe('telegram runtime eruda gating', () => {
  test('enables eruda only in development builds', () => {
    expect(shouldInitEruda(true, true)).toBe(true);
    expect(shouldInitEruda(false, true)).toBe(false);
    expect(shouldInitEruda(true, false)).toBe(false);
    expect(shouldInitEruda(false, false)).toBe(false);
  });
});