import type { DisplayDataValue } from '@/shared/domain/display-data';

export type TonConnectAccountField = 'address' | 'chain' | 'publicKey';
export type TonConnectDeviceField =
  | 'appName'
  | 'appVersion'
  | 'maxProtocolVersion'
  | 'platform'
  | 'features';

export interface TonConnectFieldRow<Field extends string> {
  field: Field;
  value: DisplayDataValue;
}

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
      accountRows: TonConnectFieldRow<TonConnectAccountField>[];
      deviceRows: TonConnectFieldRow<TonConnectDeviceField>[];
    };