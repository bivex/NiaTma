import { describe, expect, test } from 'bun:test';

import { buildAuthRedirectPath, resolvePostAuthPath } from './navigation';

describe('auth navigation', () => {
  test('accepts only safe internal post-auth paths', () => {
    expect(resolvePostAuthPath('/profile')).toBe('/profile');
    expect(resolvePostAuthPath('/profile?tab=identity')).toBe('/profile?tab=identity');
    expect(resolvePostAuthPath('//evil.example')).toBeUndefined();
    expect(resolvePostAuthPath('https://evil.example')).toBeUndefined();
    expect(resolvePostAuthPath('/auth')).toBeUndefined();
  });

  test('builds auth redirect path with encoded next parameter', () => {
    expect(buildAuthRedirectPath('/profile?tab=identity')).toBe('/auth?next=%2Fprofile%3Ftab%3Didentity');
    expect(buildAuthRedirectPath('https://evil.example')).toBe('/auth');
  });
});