'use client';

import { useTonWallet } from '@tonconnect/ui-react';

import type { TonWalletSnapshot } from '../domain/models';

export function useTonWalletSnapshot(): TonWalletSnapshot | null {
  const wallet = useTonWallet();

  if (!wallet) {
    return null;
  }

  return {
    provider: {
      aboutUrl: 'aboutUrl' in wallet ? wallet.aboutUrl : undefined,
      appName: 'appName' in wallet ? wallet.appName : undefined,
      imageUrl: 'imageUrl' in wallet ? wallet.imageUrl : undefined,
      name: 'name' in wallet ? wallet.name : undefined,
    },
    account: {
      address: wallet.account.address,
      chain: wallet.account.chain,
      publicKey: wallet.account.publicKey,
    },
    device: {
      appName: wallet.device.appName,
      appVersion: wallet.device.appVersion,
      maxProtocolVersion: String(wallet.device.maxProtocolVersion),
      platform: wallet.device.platform,
      features: wallet.device.features.flatMap((feature) =>
        typeof feature === 'object' ? [feature.name] : [],
      ),
    },
  };
}