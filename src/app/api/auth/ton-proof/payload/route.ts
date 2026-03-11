import { NextResponse } from 'next/server';

import { createAuthConfig } from '@/features/auth/infrastructure/server/config';
import { issueTonProofPayload } from '@/features/auth/infrastructure/server/tonProofPayloadStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = createAuthConfig();

  if (!config.sessionSecret) {
    return NextResponse.json({ message: 'TON proof auth is not configured.' }, { status: 503 });
  }

  return NextResponse.json(await issueTonProofPayload(config.tonProofPayloadTtlSeconds), {
    headers: { 'cache-control': 'no-store' },
  });
}