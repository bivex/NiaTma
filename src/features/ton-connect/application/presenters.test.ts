import { describe, expect, test } from 'bun:test';

import { buildTonConnectScreenModel } from './presenters';

describe('ton-connect presenters', () => {
  test('returns disconnected state when wallet is missing', () => {
    expect(buildTonConnectScreenModel(null)).toEqual({ status: 'disconnected' });
  });

  test('builds connected view model from wallet snapshot', () => {
    const screen = buildTonConnectScreenModel({
      provider: {
        aboutUrl: 'https://wallet.test',
        appName: 'Wallet App',
        imageUrl: 'https://wallet.test/logo.png',
        name: 'Wallet',
      },
      account: {
        address: 'EQD123',
        chain: 'testnet',
        publicKey: 'pub',
      },
      device: {
        appName: 'Wallet App',
        appVersion: '1.0.0',
        maxProtocolVersion: '2',
        platform: 'ios',
        features: ['sendTransaction', 'signData'],
      },
    });

    expect(screen.status).toBe('connected');
    if (screen.status === 'connected') {
      expect(screen.deviceRows[4]).toEqual({
        title: 'Features',
        value: { kind: 'text', text: 'sendTransaction, signData' },
      });
    }
  });
});