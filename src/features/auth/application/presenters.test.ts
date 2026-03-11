import { describe, expect, test } from 'bun:test';

import { buildAuthScreenModel } from './presenters';

describe('auth presenters', () => {
  test('maps auth snapshot into screen sections', () => {
    const screen = buildAuthScreenModel({
      rawInitDataPresent: true,
      telegramAuthAvailable: true,
      sessionSigningConfigured: true,
      devLoginAvailable: false,
      sessionStatus: 'authenticated',
      sessionProvider: 'telegram',
      sessionSubject: 'telegram:1',
      sessionDisplayName: 'Vladislav',
      sessionUsername: 'vlad',
      sessionWalletProvider: 'Tonkeeper',
      sessionWalletAddress: 'EQD123',
      sessionWalletChain: 'testnet',
      sessionIssuedAt: '11:00:00',
      sessionExpiresAt: '12:00:00',
      initDataHref: '/init-data',
      platformHref: '/platform',
      profileHref: '/profile',
      tonConnectHref: '/ton-connect',
    });

    expect(screen.sections[0]?.rows[1]).toEqual({
      field: 'telegramAuthAvailable',
      value: { kind: 'boolean', checked: true },
    });
    expect(screen.sections[1]?.rows[3]).toEqual({
      field: 'sessionDisplayName',
      value: { kind: 'text', text: 'Vladislav' },
    });
    expect(screen.sections[1]?.rows[5]).toEqual({
      field: 'sessionWalletProvider',
      value: { kind: 'text', text: 'Tonkeeper' },
    });
    expect(screen.sections[2]?.rows[0]).toEqual({
      field: 'initData',
      value: { kind: 'link', href: '/init-data' },
    });
    expect(screen.sections[2]?.rows[3]).toEqual({
      field: 'tonConnect',
      value: { kind: 'link', href: '/ton-connect' },
    });
  });
});