import type { DisplayDataRow } from '@/shared/domain/display-data';

export interface TonWalletSnapshot {
  provider?: {
    aboutUrl?: string;
    appName?: string;
    imageUrl?: string;
    name?: string;
  };
  account: {
    address?: string;
    chain?: string;
    publicKey?: string;
  };
  device: {
    appName?: string;
    appVersion?: string;
    maxProtocolVersion?: string;
    platform?: string;
    features: string[];
  };
}

export type TonConnectScreenModel =
  | { status: 'disconnected' }
  | {
      status: 'connected';
      provider?: TonWalletSnapshot['provider'];
      accountRows: DisplayDataRow[];
      deviceRows: DisplayDataRow[];
    };