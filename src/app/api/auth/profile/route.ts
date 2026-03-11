import { NextResponse } from 'next/server';

import { toAuthUserProfile } from '@/features/auth/application/profile';
import { createAuthConfig } from '@/features/auth/infrastructure/server/config';
import { AUTH_SESSION_COOKIE_NAME } from '@/features/auth/infrastructure/server/session';
import { readAuthenticatedAuthSession } from '@/features/auth/infrastructure/server/status';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = createAuthConfig();
  const { session, shouldClearCookie } = await readAuthenticatedAuthSession(config);

  if (!session) {
    const response = NextResponse.json({ message: 'Authentication required.' }, { status: 401 });

    if (shouldClearCookie) {
      response.cookies.delete(AUTH_SESSION_COOKIE_NAME);
    }

    return response;
  }

  return NextResponse.json(toAuthUserProfile(session), {
    headers: { 'cache-control': 'no-store' },
  });
}