import type { DisplayDataRow } from '@/shared/domain/display-data';

import type { TonConnectScreenModel, TonWalletSnapshot } from '../domain/models';

function textRow(title: string, text?: string): DisplayDataRow {
  return { title, value: { kind: 'text', text } };
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
      textRow('Address', wallet.account.address),
      textRow('Chain', wallet.account.chain),
      textRow('Public Key', wallet.account.publicKey),
    ],
    deviceRows: [
      textRow('App Name', wallet.device.appName),
      textRow('App Version', wallet.device.appVersion),
      textRow('Max Protocol Version', wallet.device.maxProtocolVersion),
      textRow('Platform', wallet.device.platform),
      textRow('Features', wallet.device.features.join(', ')),
    ],
  };
}