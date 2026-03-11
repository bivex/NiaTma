import { NextResponse } from 'next/server';

import { createAppConfig } from '@/shared/config/appConfig';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const config = createAppConfig();
  const url = new URL(request.url);

  return NextResponse.json(
    {
      appName: config.appName,
      serverTime: new Date().toISOString(),
      runtime: `${process.release.name} ${process.version}`,
      path: url.pathname,
    },
    {
      headers: {
        'cache-control': 'no-store',
      },
    },
  );
}