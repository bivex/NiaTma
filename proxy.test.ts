import { describe, expect, test } from 'bun:test';
import { NextRequest } from 'next/server';

import { createAuthSession, encodeAuthSession } from '@/features/auth/infrastructure/server/session';

import { config, proxy } from './src/proxy';

describe('proxy auth protection', () => {
  test('targets protected profile routes via static matcher config', () => {
    expect(config).toEqual({
      matcher: ['/profile', '/profile/:path*'],
    });
  });

  test('redirects anonymous users to auth with next param', () => {
    const response = proxy(new NextRequest('http://localhost:3000/profile?tab=identity'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/auth?next=%2Fprofile%3Ftab%3Didentity');
  });

  test('allows authenticated users through', () => {
    const session = createAuthSession({
      provider: 'dev',
      user: { id: 'local-preview', firstName: 'Local' },
      ttlSeconds: 60,
      nowMs: Date.now(),
    });
    const token = encodeAuthSession(session, 'nia-dev-session-secret');
    const response = proxy(
      new NextRequest('http://localhost:3000/profile', {
        headers: {
          cookie: `nia_auth_session=${token}`,
        },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });
});