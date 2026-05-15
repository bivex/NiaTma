import type { AuthProvider } from './session';
import type { AuthLinkedWallet } from './wallet';

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
