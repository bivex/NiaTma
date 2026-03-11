import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { buildAuthRedirectPath } from '@/features/auth/application/navigation';
import { createAuthConfig } from '@/features/auth/infrastructure/server/config';
import { AUTH_SESSION_COOKIE_NAME, decodeAuthSession } from '@/features/auth/infrastructure/server/session';

function createAuthRedirectResponse(request: NextRequest) {
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  return NextResponse.redirect(new URL(buildAuthRedirectPath(nextPath), request.url));
}

export function proxy(request: NextRequest) {
  const config = createAuthConfig();
  const token = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value;

  if (!token || !config.sessionSecret) {
    return createAuthRedirectResponse(request);
  }

  const session = decodeAuthSession(token, config.sessionSecret);

  if (!session.valid) {
    const response = createAuthRedirectResponse(request);
    response.cookies.delete(AUTH_SESSION_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/profile/:path*'],
};