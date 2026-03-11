import { describe, expect, test } from 'bun:test';

import { buildProfileScreenModel, toAuthUserProfile } from './profile';

describe('auth profile', () => {
  test('maps session into normalized user profile', () => {
    expect(
      toAuthUserProfile({
        sub: 'telegram:42',
        provider: 'telegram',
        issuedAt: 1_000,
        expiresAt: 2_000,
        user: {
          id: '42',
          firstName: 'Nia',
          lastName: 'Bot',
          username: 'nia',
          languageCode: 'en',
        },
      }),
    ).toEqual({
      subject: 'telegram:42',
      provider: 'telegram',
      userId: '42',
      displayName: 'Nia Bot',
      username: 'nia',
      languageCode: 'en',
      issuedAt: 1_000,
      expiresAt: 2_000,
    });
  });

  test('builds profile screen sections', () => {
    const screen = buildProfileScreenModel({
      subject: 'telegram:42',
      provider: 'telegram',
      userId: '42',
      displayName: 'Nia Bot',
      username: 'nia',
      languageCode: 'en',
      issuedAt: '11:00',
      expiresAt: '12:00',
      authHref: '/auth',
      platformHref: '/platform',
    });

    expect(screen.sections[0]?.rows[3]).toEqual({
      field: 'displayName',
      value: { kind: 'text', text: 'Nia Bot' },
    });
    expect(screen.sections[2]?.rows[0]).toEqual({
      field: 'auth',
      value: { kind: 'link', href: '/auth' },
    });
  });
});