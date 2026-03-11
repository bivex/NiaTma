import { describe, expect, test } from 'bun:test';

import { createAuthLinkedWallet, parseAuthLinkedWalletInput } from './wallet';

describe('auth wallet helpers', () => {
  test('parses valid wallet link input', () => {
    expect(
      parseAuthLinkedWalletInput({
        address: 'EQD123',
        chain: 'testnet',
        publicKey: 'pub',
        provider: 'Tonkeeper',
      }),
    ).toEqual({
      address: 'EQD123',
      chain: 'testnet',
      publicKey: 'pub',
      provider: 'Tonkeeper',
    });
  });

  test('rejects invalid wallet link input and stamps linked wallet snapshots', () => {
    expect(parseAuthLinkedWalletInput({ address: '' })).toBeUndefined();
    expect(createAuthLinkedWallet({ address: 'EQD123', chain: 'mainnet' }, { linkedAt: 1_234 })).toEqual({
      address: 'EQD123',
      chain: 'mainnet',
      linkedAt: 1_234,
    });
  });
});