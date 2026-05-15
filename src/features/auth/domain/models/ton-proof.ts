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
