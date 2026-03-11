import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';

import { keyPairFromSeed, sign } from '@ton/crypto';
import { beginCell, storeStateInit, WalletContractV4 } from '@ton/ton';

const port = 3300 + Math.floor(Math.random() * 100);
const baseUrl = `http://127.0.0.1:${port}`;

let server: ChildProcessWithoutNullStreams;
let serverOutput = '';

async function createTonProofRequest(payload: string, domain: string) {
  const keyPair = keyPairFromSeed(Buffer.alloc(32, 9));
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
  const timestamp = Math.floor(Date.now() / 1000);
  const domainLength = Buffer.alloc(4);
  domainLength.writeUInt32LE(Buffer.byteLength(domain), 0);
  const timestampBuffer = Buffer.alloc(8);
  timestampBuffer.writeBigUInt64LE(BigInt(timestamp), 0);
  const workchain = Buffer.alloc(4);
  workchain.writeInt32BE(wallet.address.workChain, 0);
  const message = Buffer.concat([
    Buffer.from('ton-proof-item-v2/'),
    workchain,
    wallet.address.hash,
    domainLength,
    Buffer.from(domain),
    timestampBuffer,
    Buffer.from(payload),
  ]);
  const messageHash = Buffer.from(await crypto.subtle.digest('SHA-256', message));
  const digest = Buffer.from(
    await crypto.subtle.digest('SHA-256', Buffer.concat([Buffer.from([0xff, 0xff]), Buffer.from('ton-connect'), messageHash])),
  );

  return {
    address: wallet.address.toRawString(),
    chain: '-239',
    publicKey: keyPair.publicKey.toString('hex'),
    walletStateInit: beginCell().store(storeStateInit(wallet.init)).endCell().toBoc().toString('base64'),
    provider: 'Tonkeeper',
    proof: {
      timestamp,
      domain: {
        lengthBytes: Buffer.byteLength(domain),
        value: domain,
      },
      payload,
      signature: sign(digest, keyPair.secretKey).toString('base64'),
    },
  };
}

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
    const anonymousPremium = await fetch(`${baseUrl}/premium`, { redirect: 'manual' });
    expect(anonymousPremium.status).toBe(200);
    expect(await anonymousPremium.text()).toContain('Requires a verified TON wallet session');

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

    const walletLinkResponse = await fetch(`${baseUrl}/api/auth/wallet`, {
      method: 'POST',
      headers: {
        cookie: sessionCookie || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        address: 'EQD123',
        chain: 'testnet',
        publicKey: 'pub',
        provider: 'Tonkeeper',
      }),
    });
    expect(walletLinkResponse.status).toBe(200);

    const linkedSessionCookie = readSessionCookie(walletLinkResponse) || sessionCookie;
    expect(linkedSessionCookie).toContain('nia_auth_session=');

    const linkedProfileApiResponse = await fetch(`${baseUrl}/api/auth/profile`, {
      headers: { cookie: linkedSessionCookie || '' },
    });
    expect(linkedProfileApiResponse.status).toBe(200);

    const linkedProfile = (await linkedProfileApiResponse.json()) as {
      wallet?: { address?: string; provider?: string };
    };
    expect(linkedProfile.wallet?.address).toBe('EQD123');
    expect(linkedProfile.wallet?.provider).toBe('Tonkeeper');

    const profilePageResponse = await fetch(`${baseUrl}/profile`, {
      headers: { cookie: linkedSessionCookie || '' },
    });
    expect(profilePageResponse.status).toBe(200);

    const profilePageHtml = await profilePageResponse.text();
    expect(profilePageHtml).toContain('Protected user profile');
    expect(profilePageHtml).toContain('dev:local-preview');
    expect(profilePageHtml).toContain('EQD123');

    const linkedPremiumResponse = await fetch(`${baseUrl}/premium`, {
      headers: { cookie: linkedSessionCookie || '' },
    });
    expect(linkedPremiumResponse.status).toBe(200);
    expect(await linkedPremiumResponse.text()).toContain('Linking a wallet to a Telegram/dev session is not enough');

    const walletUnlinkResponse = await fetch(`${baseUrl}/api/auth/wallet`, {
      method: 'DELETE',
      headers: { cookie: linkedSessionCookie || '' },
    });
    expect(walletUnlinkResponse.status).toBe(200);

    const unlinkedSessionCookie = readSessionCookie(walletUnlinkResponse) || linkedSessionCookie;
    const unlinkedProfileApiResponse = await fetch(`${baseUrl}/api/auth/profile`, {
      headers: { cookie: unlinkedSessionCookie || '' },
    });
    const unlinkedProfile = (await unlinkedProfileApiResponse.json()) as { wallet?: unknown };
    expect(unlinkedProfile.wallet).toBeUndefined();

    const payloadResponse = await fetch(`${baseUrl}/api/auth/ton-proof/payload`);
    expect(payloadResponse.status).toBe(200);
    const tonProofPayload = (await payloadResponse.json()) as { payload: string };

    const verifyResponse = await fetch(`${baseUrl}/api/auth/ton-proof/verify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(await createTonProofRequest(tonProofPayload.payload, `127.0.0.1:${port}`)),
    });
    expect(verifyResponse.status).toBe(200);

    const tonSessionCookie = readSessionCookie(verifyResponse);
    expect(tonSessionCookie).toContain('nia_auth_session=');

    const tonProfileResponse = await fetch(`${baseUrl}/api/auth/profile`, {
      headers: { cookie: tonSessionCookie || '' },
    });
    expect(tonProfileResponse.status).toBe(200);
    const tonProfile = (await tonProfileResponse.json()) as { provider: string; subject: string; wallet?: { address?: string } };
    expect(tonProfile.provider).toBe('ton');
    expect(tonProfile.subject.startsWith('ton:')).toBe(true);

    const premiumResponse = await fetch(`${baseUrl}/premium`, {
      headers: { cookie: tonSessionCookie || '' },
    });
    expect(premiumResponse.status).toBe(200);
    const premiumHtml = await premiumResponse.text();
    expect(premiumHtml).toContain('Premium wallet-gated preview unlocked');
    expect(premiumHtml).toContain(tonProfile.wallet?.address || '');
  });
});