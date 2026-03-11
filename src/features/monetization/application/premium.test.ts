import { describe, expect, test } from 'bun:test';

import { resolveWalletPremiumAccess } from './premium';

describe('premium entitlement resolution', () => {
  test('returns unlocked access when wallet premium entitlement is active', () => {
    expect(
      resolveWalletPremiumAccess({
        sub: 'ton:0:wallet',
        provider: 'ton',
        issuedAt: 1,
        expiresAt: 2,
        user: { id: '0:wallet', firstName: 'TON', lastName: 'Wallet' },
        wallet: { address: '0:wallet', provider: 'Tonkeeper', linkedAt: 1, verifiedAt: 1 },
        entitlements: { walletPremium: { active: true, source: 'ton-proof', grantedAt: 1 } },
      }),
    ).toEqual({
      enabled: true,
      active: true,
      reason: 'granted',
      grantedAt: 1,
      provider: 'Tonkeeper',
      walletAddress: '0:wallet',
    });
  });

  test('returns locked access for linked but not verified wallets', () => {
    expect(
      resolveWalletPremiumAccess({
        sub: 'dev:preview',
        provider: 'dev',
        issuedAt: 1,
        expiresAt: 2,
        user: { id: 'preview' },
        wallet: { address: '0:wallet', provider: 'Tonkeeper', linkedAt: 1 },
      }),
    ).toEqual({
      enabled: true,
      active: false,
      reason: 'wallet_linked_only',
      provider: 'Tonkeeper',
      walletAddress: '0:wallet',
    });
  });
});