import { NextResponse } from 'next/server';

import { createAuthLinkedWallet } from '@/features/auth/application/wallet';
import { createAuthConfig } from '@/features/auth/infrastructure/server/config';
import {
  AUTH_SESSION_COOKIE_NAME,
  buildSessionCookieOptions,
  createAuthSession,
  encodeAuthSession,
} from '@/features/auth/infrastructure/server/session';
import { parseVerifyAuthTonProofInput, verifyAuthTonProof } from '@/features/auth/infrastructure/server/tonProof';
import { consumeTonProofPayload } from '@/features/auth/infrastructure/server/tonProofPayloadStore';
import { createAuthenticatedAuthStatus } from '@/features/auth/infrastructure/server/status';

export const dynamic = 'force-dynamic';

function resolveExpectedDomain(request: Request) {
  const forwardedHost = request.headers.get('x-forwarded-host');

  if (forwardedHost) {
    return forwardedHost.split(',')[0]?.trim();
  }

  return new URL(request.url).host;
}

export async function POST(request: Request) {
  const config = createAuthConfig();

  if (!config.sessionSecret) {
    return NextResponse.json({ message: 'TON proof auth is not configured.' }, { status: 503 });
  }

  const payload = parseVerifyAuthTonProofInput(await request.json().catch(() => undefined));

  if (!payload) {
    return NextResponse.json({ message: 'Invalid TON proof payload.' }, { status: 400 });
  }

  const verified = await verifyAuthTonProof(payload, {
    expectedDomain: resolveExpectedDomain(request),
    maxAgeSeconds: config.tonProofMaxAgeSeconds,
    consumePayload: consumeTonProofPayload,
  });

  if (!verified) {
    return NextResponse.json({ message: 'TON proof verification failed.' }, { status: 401 });
  }

  const verifiedAt = Date.now();
  const session = createAuthSession({
    provider: 'ton',
    user: {
      id: payload.address,
      firstName: payload.provider || 'TON',
      lastName: 'Wallet',
    },
    ttlSeconds: config.sessionTtlSeconds,
  });

  session.wallet = createAuthLinkedWallet(
    {
      address: payload.address,
      chain: payload.chain,
      publicKey: payload.publicKey,
      provider: payload.provider || 'TON Wallet',
    },
    { linkedAt: verifiedAt, verifiedAt },
  );
  session.entitlements = {
    walletPremium: {
      active: true,
      source: 'ton-proof',
      grantedAt: verifiedAt,
    },
  };

  const response = NextResponse.json(createAuthenticatedAuthStatus(config, session), {
    headers: { 'cache-control': 'no-store' },
  });

  response.cookies.set({
    name: AUTH_SESSION_COOKIE_NAME,
    value: encodeAuthSession(session, config.sessionSecret),
    ...buildSessionCookieOptions(session.expiresAt, config.secureCookies),
  });

  return response;
}