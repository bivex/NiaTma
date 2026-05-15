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
