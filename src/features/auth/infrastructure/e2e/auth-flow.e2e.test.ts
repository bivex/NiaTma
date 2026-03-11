import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';

const port = 3300 + Math.floor(Math.random() * 100);
const baseUrl = `http://127.0.0.1:${port}`;

let server: ChildProcessWithoutNullStreams;
let serverOutput = '';

async function waitForServerReady() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 30_000) {
    if (server.exitCode !== null) {
      throw new Error(`Auth e2e server exited early.\n${serverOutput}`);
    }

    try {
      const response = await fetch(`${baseUrl}/auth`, { redirect: 'manual' });
      if (response.status >= 200 && response.status < 500) return;
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for auth e2e server.\n${serverOutput}`);
}

function readSessionCookie(response: Response) {
  const header =
    response.headers.get('set-cookie') ||
    (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.()[0];

  return header?.split(';', 1)[0];
}

describe('auth flow e2e', () => {
  beforeAll(async () => {
    server = spawn(process.execPath, ['run', 'start', '--', '--port', String(port)], {
      cwd: process.cwd(),
      env: { ...process.env, AUTH_SESSION_SECRET: 'test-secret', AUTH_ALLOW_DEV_LOGIN: 'true' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    server.stdout.on('data', (chunk) => {
      serverOutput += chunk.toString();
    });
    server.stderr.on('data', (chunk) => {
      serverOutput += chunk.toString();
    });

    await waitForServerReady();
  });

  afterAll(() => {
    server.kill();
  });

  test('redirects anonymous users and admits authenticated users to the protected profile flow', async () => {
    const anonymousProfile = await fetch(`${baseUrl}/profile?tab=identity`, { redirect: 'manual' });
    expect(anonymousProfile.status).toBe(307);
    expect(anonymousProfile.headers.get('location')).toBe('/auth?next=%2Fprofile%3Ftab%3Didentity');

    const loginResponse = await fetch(`${baseUrl}/api/auth/dev-login`, { method: 'POST', redirect: 'manual' });
    expect(loginResponse.status).toBe(200);

    const sessionCookie = readSessionCookie(loginResponse);
    expect(sessionCookie).toContain('nia_auth_session=');

    const profileApiResponse = await fetch(`${baseUrl}/api/auth/profile`, {
      headers: { cookie: sessionCookie || '' },
    });
    expect(profileApiResponse.status).toBe(200);

    const profile = (await profileApiResponse.json()) as { subject: string; displayName?: string };
    expect(profile.subject).toBe('dev:local-preview');
    expect(profile.displayName).toBe('Local Preview');

    const profilePageResponse = await fetch(`${baseUrl}/profile`, {
      headers: { cookie: sessionCookie || '' },
    });
    expect(profilePageResponse.status).toBe(200);

    const profilePageHtml = await profilePageResponse.text();
    expect(profilePageHtml).toContain('Protected user profile');
    expect(profilePageHtml).toContain('dev:local-preview');
  });
});