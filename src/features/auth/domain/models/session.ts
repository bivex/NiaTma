import type { AuthLinkedWallet } from './wallet';

export type AuthProvider = 'telegram' | 'dev' | 'ton';

export interface AuthEntitlement {
  active: boolean;
  source: 'ton-proof';
  grantedAt: number;
}

export interface AuthSessionEntitlements {
  walletPremium?: AuthEntitlement;
}

export interface AuthSessionUser {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
}

export interface AuthSession {
  sub: string;
  provider: AuthProvider;
  issuedAt: number;
  expiresAt: number;
  user: AuthSessionUser;
  wallet?: AuthLinkedWallet;
  entitlements?: AuthSessionEntitlements;
}

export interface AuthCapabilities {
  telegramAuthAvailable: boolean;
  sessionSigningConfigured: boolean;
  devLoginAvailable: boolean;
}

export interface AuthSessionStatus {
  status: 'authenticated' | 'anonymous';
  capabilities: AuthCapabilities;
  session?: AuthSession;
}
