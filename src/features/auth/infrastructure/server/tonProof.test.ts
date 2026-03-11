import { describe, expect, test } from 'bun:test';

import { keyPairFromSeed, sign } from '@ton/crypto';
import { beginCell, storeStateInit, WalletContractV4 } from '@ton/ton';

import { buildTonProofDigest, verifyAuthTonProof } from './tonProof';

describe('ton proof verification', () => {
  test('verifies a standard wallet v4 ton_proof payload', async () => {
    const keyPair = keyPairFromSeed(Buffer.alloc(32, 7));
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
    const address = wallet.address.toRawString();
    const payload = 'proof-payload';
    const timestamp = Math.floor(Date.now() / 1000);
    const domain = 'localhost:3000';
    const signature = sign(
      await buildTonProofDigest({
        address: wallet.address,
        domain,
        payload,
        timestamp,
      }),
      keyPair.secretKey,
    ).toString('base64');

    expect(
      await verifyAuthTonProof(
        {
          address,
          chain: '-239',
          publicKey: keyPair.publicKey.toString('hex'),
          walletStateInit: beginCell().store(storeStateInit(wallet.init)).endCell().toBoc().toString('base64'),
          provider: 'Tonkeeper',
          proof: {
            timestamp,
            domain: { lengthBytes: Buffer.byteLength(domain), value: domain },
            payload,
            signature,
          },
        },
        {
          expectedDomain: domain,
          maxAgeSeconds: 60,
          consumePayload: (candidate) => candidate === payload,
        },
      ),
    ).toBe(true);
  });

  test('rejects proof when payload cannot be consumed', async () => {
    const keyPair = keyPairFromSeed(Buffer.alloc(32, 3));
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
    const payload = 'proof-payload';
    const timestamp = Math.floor(Date.now() / 1000);
    const domain = 'localhost:3000';

    expect(
      await verifyAuthTonProof(
        {
          address: wallet.address.toRawString(),
          publicKey: keyPair.publicKey.toString('hex'),
          walletStateInit: beginCell().store(storeStateInit(wallet.init)).endCell().toBoc().toString('base64'),
          proof: {
            timestamp,
            domain: { lengthBytes: Buffer.byteLength(domain), value: domain },
            payload,
            signature: sign(
              await buildTonProofDigest({ address: wallet.address, domain, payload, timestamp }),
              keyPair.secretKey,
            ).toString('base64'),
          },
        },
        {
          expectedDomain: domain,
          maxAgeSeconds: 60,
          consumePayload: () => false,
        },
      ),
    ).toBe(false);
  });
});