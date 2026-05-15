import type {
  AuthScreenModel,
  AuthScreenSnapshot,
  AuthSessionStatus,
} from '../domain/models';

export interface AuthScreenSnapshotContext {
  rawInitDataPresent: boolean;
  isPending: boolean;
  t: (key: string) => string;
  formatTime: (date: number) => string;
  initDataUserFirstName?: string;
  initDataHref: string;
  platformHref: string;
  profileHref: string;
  tonConnectHref: string;
}

export function toAuthScreenSnapshot(
  status: AuthSessionStatus | undefined,
  context: AuthScreenSnapshotContext,
): AuthScreenSnapshot {
  const session = status?.session;
  const displayName = [session?.user.firstName, session?.user.lastName].filter(Boolean).join(' ') || undefined;

  return {
    rawInitDataPresent: context.rawInitDataPresent,
    telegramAuthAvailable: status?.capabilities.telegramAuthAvailable ?? false,
    sessionSigningConfigured: status?.capabilities.sessionSigningConfigured ?? false,
    devLoginAvailable: status?.capabilities.devLoginAvailable ?? false,
    sessionStatus: context.isPending ? context.t('status.loading') : status?.status || context.t('status.anonymous'),
    sessionProvider: session?.provider,
    sessionSubject: session?.sub,
    sessionDisplayName: displayName || context.initDataUserFirstName,
    sessionUsername: session?.user.username,
    sessionWalletProvider: session?.wallet?.provider,
    sessionWalletAddress: session?.wallet?.address,
    sessionWalletChain: session?.wallet?.chain,
    sessionIssuedAt: session ? context.formatTime(session.issuedAt) : undefined,
    sessionExpiresAt: session ? context.formatTime(session.expiresAt) : undefined,
    initDataHref: context.initDataHref,
    platformHref: context.platformHref,
    profileHref: context.profileHref,
    tonConnectHref: context.tonConnectHref,
  };
}

export function buildAuthScreenModel(snapshot: AuthScreenSnapshot): AuthScreenModel {
  const rows = [
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
  ] as const;

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
        rows: rows.map((row) => ({ field: row.field, value: row.value })),
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