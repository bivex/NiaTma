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