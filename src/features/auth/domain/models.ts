import type { DisplayDataValue } from '@/shared/domain/display-data';

export type AuthProvider = 'telegram' | 'dev' | 'ton';

export interface AuthLinkedWalletInput {
  address: string;
  chain?: string;
  publicKey?: string;
  provider?: string;
}

export interface AuthLinkedWallet extends AuthLinkedWalletInput {
  linkedAt: number;
  verifiedAt?: number;
}

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

export interface AuthTonProof {
  timestamp: number;
  domain: {
    lengthBytes: number;
    value: string;
  };
  payload: string;
  signature: string;
}

export interface AuthTonProofPayload {
  payload: string;
  expiresAt: number;
}

export interface VerifyAuthTonProofInput {
  address: string;
  chain?: string;
  publicKey: string;
  walletStateInit: string;
  provider?: string;
  proof: AuthTonProof;
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

export type AuthSectionId = 'capabilities' | 'session' | 'links';

export type AuthFieldId =
  | 'rawInitDataPresent'
  | 'telegramAuthAvailable'
  | 'sessionSigningConfigured'
  | 'devLoginAvailable'
  | 'sessionStatus'
  | 'sessionProvider'
  | 'sessionSubject'
  | 'sessionDisplayName'
  | 'sessionUsername'
  | 'sessionWalletProvider'
  | 'sessionWalletAddress'
  | 'sessionWalletChain'
  | 'sessionIssuedAt'
  | 'sessionExpiresAt'
  | 'initData'
  | 'platform'
  | 'profile'
  | 'tonConnect';

export interface AuthRow {
  field: AuthFieldId;
  value: DisplayDataValue;
}

export interface AuthSection {
  id: AuthSectionId;
  rows: AuthRow[];
}

export interface AuthScreenModel {
  sections: AuthSection[];
}

export interface AuthScreenSnapshot {
  rawInitDataPresent: boolean;
  telegramAuthAvailable: boolean;
  sessionSigningConfigured: boolean;
  devLoginAvailable: boolean;
  sessionStatus: string;
  sessionProvider?: string;
  sessionSubject?: string;
  sessionDisplayName?: string;
  sessionUsername?: string;
  sessionWalletProvider?: string;
  sessionWalletAddress?: string;
  sessionWalletChain?: string;
  sessionIssuedAt?: string;
  sessionExpiresAt?: string;
  initDataHref: string;
  platformHref: string;
  profileHref: string;
  tonConnectHref: string;
}

export interface AuthUserProfile {
  subject: string;
  provider: AuthProvider;
  userId: string;
  displayName?: string;
  username?: string;
  languageCode?: string;
  issuedAt: number;
  expiresAt: number;
  wallet?: AuthLinkedWallet;
}

export type ProfileSectionId = 'identity' | 'wallet' | 'session' | 'links';

export type ProfileFieldId =
  | 'subject'
  | 'provider'
  | 'userId'
  | 'displayName'
  | 'username'
  | 'languageCode'
  | 'walletProvider'
  | 'walletAddress'
  | 'walletChain'
  | 'walletPublicKey'
  | 'walletLinkedAt'
  | 'issuedAt'
  | 'expiresAt'
  | 'auth'
  | 'platform'
  | 'tonConnect';

export interface ProfileRow {
  field: ProfileFieldId;
  value: DisplayDataValue;
}

export interface ProfileSection {
  id: ProfileSectionId;
  rows: ProfileRow[];
}

export interface ProfileScreenModel {
  sections: ProfileSection[];
}

export interface ProfileScreenSnapshot {
  subject: string;
  provider: string;
  userId: string;
  displayName?: string;
  username?: string;
  languageCode?: string;
  walletProvider?: string;
  walletAddress?: string;
  walletChain?: string;
  walletPublicKey?: string;
  walletLinkedAt?: string;
  issuedAt: string;
  expiresAt: string;
  authHref: string;
  platformHref: string;
  tonConnectHref: string;
}