import type { DisplayDataValue } from '@/shared/domain/display-data';

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
