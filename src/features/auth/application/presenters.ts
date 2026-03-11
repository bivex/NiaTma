import type { AuthRow, AuthScreenModel, AuthScreenSnapshot } from '../domain/models';

export function buildAuthScreenModel(snapshot: AuthScreenSnapshot): AuthScreenModel {
  const sessionRows: AuthRow[] = [
    { field: 'sessionStatus', value: { kind: 'text', text: snapshot.sessionStatus } },
    { field: 'sessionProvider', value: { kind: 'text', text: snapshot.sessionProvider } },
    { field: 'sessionSubject', value: { kind: 'text', text: snapshot.sessionSubject } },
    { field: 'sessionDisplayName', value: { kind: 'text', text: snapshot.sessionDisplayName } },
    { field: 'sessionUsername', value: { kind: 'text', text: snapshot.sessionUsername } },
    { field: 'sessionWalletProvider', value: { kind: 'text', text: snapshot.sessionWalletProvider } },
    { field: 'sessionWalletAddress', value: { kind: 'text', text: snapshot.sessionWalletAddress } },
    { field: 'sessionWalletChain', value: { kind: 'text', text: snapshot.sessionWalletChain } },
    { field: 'sessionIssuedAt', value: { kind: 'text', text: snapshot.sessionIssuedAt } },
    { field: 'sessionExpiresAt', value: { kind: 'text', text: snapshot.sessionExpiresAt } },
  ];

  return {
    sections: [
      {
        id: 'capabilities',
        rows: [
          { field: 'rawInitDataPresent', value: { kind: 'boolean', checked: snapshot.rawInitDataPresent } },
          {
            field: 'telegramAuthAvailable',
            value: { kind: 'boolean', checked: snapshot.telegramAuthAvailable },
          },
          {
            field: 'sessionSigningConfigured',
            value: { kind: 'boolean', checked: snapshot.sessionSigningConfigured },
          },
          { field: 'devLoginAvailable', value: { kind: 'boolean', checked: snapshot.devLoginAvailable } },
        ],
      },
      {
        id: 'session',
        rows: sessionRows,
      },
      {
        id: 'links',
        rows: [
          { field: 'initData', value: { kind: 'link', href: snapshot.initDataHref } },
          { field: 'platform', value: { kind: 'link', href: snapshot.platformHref } },
          { field: 'profile', value: { kind: 'link', href: snapshot.profileHref } },
          { field: 'tonConnect', value: { kind: 'link', href: snapshot.tonConnectHref } },
        ],
      },
    ],
  };
}