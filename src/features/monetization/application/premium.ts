import type { AuthSession } from '@/features/auth/domain/models';

export interface WalletPremiumAccess {
  enabled: boolean;
  active: boolean;
  reason: 'disabled' | 'anonymous' | 'wallet_linked_only' | 'authenticated_non_wallet' | 'granted';
  grantedAt?: number;
  provider?: string;
  walletAddress?: string;
}

export function resolveWalletPremiumAccess(
  session: AuthSession | undefined,
  monetizationEnabled = true,
): WalletPremiumAccess {
  if (!monetizationEnabled) {
    return { enabled: false, active: false, reason: 'disabled' };
  }

  if (!session) {
    return { enabled: true, active: false, reason: 'anonymous' };
  }

  const { entitlements, wallet } = session;
  const walletPremium = entitlements?.walletPremium;

  if (walletPremium?.active) {
    return {
      enabled: true,
      active: true,
      reason: 'granted',
      grantedAt: walletPremium.grantedAt,
      provider: wallet?.provider,
      walletAddress: wallet?.address,
    };
  }

  if (wallet) {
    return {
      enabled: true,
      active: false,
      reason: 'wallet_linked_only',
      provider: wallet.provider,
      walletAddress: wallet.address,
    };
  }

  return {
    enabled: true,
    active: false,
    reason: 'authenticated_non_wallet',
  };
}