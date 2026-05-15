import type { DisplayDataValue } from '@/shared/domain/display-data';

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
