import type { DisplayDataValue } from '@/shared/domain/display-data';

export type AuthProvider = 'telegram' | 'dev';

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
  | 'sessionIssuedAt'
  | 'sessionExpiresAt'
  | 'initData'
  | 'platform';

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
  sessionIssuedAt?: string;
  sessionExpiresAt?: string;
  initDataHref: string;
  platformHref: string;
}