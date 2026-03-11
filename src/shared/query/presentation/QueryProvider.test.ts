import { describe, expect, test } from 'bun:test';

import { createQueryClient } from './QueryProvider';

describe('QueryProvider', () => {
  test('creates query client with baseline defaults', () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(30_000);
    expect(defaults?.gcTime).toBe(300_000);
    expect(defaults?.refetchOnWindowFocus).toBe(false);
    expect(defaults?.retry).toBe(1);
  });
});