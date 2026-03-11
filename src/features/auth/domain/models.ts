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
  | 'platform'
  | 'profile';

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
  profileHref: string;
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
}

export type ProfileSectionId = 'identity' | 'session' | 'links';

export type ProfileFieldId =
  | 'subject'
  | 'provider'
  | 'userId'
  | 'displayName'
  | 'username'
  | 'languageCode'
  | 'issuedAt'
  | 'expiresAt'
  | 'auth'
  | 'platform';

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
  issuedAt: string;
  expiresAt: string;
  authHref: string;
  platformHref: string;
}