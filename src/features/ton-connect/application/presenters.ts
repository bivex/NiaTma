import type { AuthLinkedWalletInput, VerifyAuthTonProofInput } from '@/features/auth/domain/models';
import type {
  TonConnectAccountField,
  TonConnectDeviceField,
  TonConnectFieldRow,
  TonConnectScreenModel,
  TonWalletSnapshot,
} from '../domain/models';

function textRow<Field extends string>(
  field: Field,
  text?: string,
): TonConnectFieldRow<Field> {
  return { field, value: { kind: 'text', text } };
}

export function toAuthLinkedWalletInput(wallet: TonWalletSnapshot | null): AuthLinkedWalletInput | undefined {
  if (!wallet) {
    return undefined;
  }

  const address = wallet.account.address?.trim();
  if (!address) {
    return undefined;
  }

  return {
    address,
    chain: wallet.account.chain,
    publicKey: wallet.account.publicKey,
    provider: wallet.provider?.name || wallet.provider?.appName,
  };
}

type TonWalletLike = {
  account: {
    address: string;
    chain: string;
    publicKey?: string;
    walletStateInit: string;
  };
  name?: string;
  connectItems?: {
    tonProof?: {
      proof: VerifyAuthTonProofInput['proof'];
    };
  };
};

export function toVerifyAuthTonProofInput(wallet: TonWalletLike): VerifyAuthTonProofInput | undefined {
  const tonProof = wallet.connectItems?.tonProof;
  if (!tonProof || !('proof' in tonProof)) {
    return undefined;
  }

  if (!wallet.account.publicKey) {
    return undefined;
  }

  return {
    address: wallet.account.address,
    chain: wallet.account.chain,
    publicKey: wallet.account.publicKey,
    walletStateInit: wallet.account.walletStateInit,
    provider: wallet.name,
    proof: tonProof.proof,
  };
}

export function buildTonConnectScreenModel(
  wallet: TonWalletSnapshot | null,
): TonConnectScreenModel {
  if (!wallet) {
    return { status: 'disconnected' };
  }

  return {
    status: 'connected',
    provider: wallet.provider,
    accountRows: [
      textRow<TonConnectAccountField>('address', wallet.account.address),
      textRow<TonConnectAccountField>('chain', wallet.account.chain),
      textRow<TonConnectAccountField>('publicKey', wallet.account.publicKey),
    ],
    deviceRows: [
      textRow<TonConnectDeviceField>('appName', wallet.device.appName),
      textRow<TonConnectDeviceField>('appVersion', wallet.device.appVersion),
      textRow<TonConnectDeviceField>('maxProtocolVersion', wallet.device.maxProtocolVersion),
      textRow<TonConnectDeviceField>('platform', wallet.device.platform),
      textRow<TonConnectDeviceField>('features', wallet.device.features.join(', ')),
    ],
  };
}