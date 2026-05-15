import { describe, expect, test } from 'bun:test';

import { keyPairFromSeed, sign } from '@ton/crypto';
import { beginCell, storeStateInit, WalletContractV4 } from '@ton/ton';

import { buildTonProofDigest, verifyAuthTonProof } from './tonProof';

async function buildTonProofPayload(
  keyPair: ReturnType<typeof keyPairFromSeed>,
  payload: string,
  domain: string,
  timestamp: number,
) {
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
  const address = wallet.address.toRawString();
  const digest = await buildTonProofDigest({ address: wallet.address, domain, payload, timestamp });
  return {
    address,
    chain: '-239',
    publicKey: keyPair.publicKey.toString('hex'),
    walletStateInit: beginCell().store(storeStateInit(wallet.init)).endCell().toBoc().toString('base64'),
    provider: 'Tonkeeper' as const,
    proof: {
      timestamp,
      domain: { lengthBytes: Buffer.byteLength(domain), value: domain },
      payload,
      signature: sign(digest, keyPair.secretKey).toString('base64'),
    },
  };
}

describe('ton proof verification', () => {
  test('verifies a standard wallet v4 ton_proof payload', async () => {
    const domain = 'localhost:3000';
    const payload = 'proof-payload';
    const timestamp = Math.floor(Date.now() / 1000);

    await expect(
      verifyAuthTonProof(
        await buildTonProofPayload(keyPairFromSeed(Buffer.alloc(32, 7)), payload, domain, timestamp),
        { expectedDomain: domain, maxAgeSeconds: 60, consumePayload: (candidate) => candidate === payload },
      ),
    ).resolves.toBe(true);
  });

  test('rejects proof when payload cannot be consumed', async () => {
    const domain = 'localhost:3000';
    const payload = 'proof-payload';
    const timestamp = Math.floor(Date.now() / 1000);

    await expect(
      verifyAuthTonProof(
        await buildTonProofPayload(keyPairFromSeed(Buffer.alloc(32, 3)), payload, domain, timestamp),
        { expectedDomain: domain, maxAgeSeconds: 60, consumePayload: () => false },
      ),
    ).resolves.toBe(false);
  });
});