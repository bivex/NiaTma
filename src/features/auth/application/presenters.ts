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
  const {
    rawInitDataPresent,
    isPending,
    t,
    formatTime,
    initDataUserFirstName,
    initDataHref,
    platformHref,
    profileHref,
    tonConnectHref,
  } = context;

  const session = status?.session;
  const capabilities = status?.capabilities;
  const displayName = [session?.user.firstName, session?.user.lastName].filter(Boolean).join(' ') || undefined;

  return {
    rawInitDataPresent,
    telegramAuthAvailable: capabilities?.telegramAuthAvailable ?? false,
    sessionSigningConfigured: capabilities?.sessionSigningConfigured ?? false,
    devLoginAvailable: capabilities?.devLoginAvailable ?? false,
    sessionStatus: isPending ? t('status.loading') : status?.status || t('status.anonymous'),
    sessionProvider: session?.provider,
    sessionSubject: session?.sub,
    sessionDisplayName: displayName || initDataUserFirstName,
    sessionUsername: session?.user.username,
    sessionWalletProvider: session?.wallet?.provider,
    sessionWalletAddress: session?.wallet?.address,
    sessionWalletChain: session?.wallet?.chain,
    sessionIssuedAt: session ? formatTime(session.issuedAt) : undefined,
    sessionExpiresAt: session ? formatTime(session.expiresAt) : undefined,
    initDataHref,
    platformHref,
    profileHref,
    tonConnectHref,
  };
}

export function buildAuthScreenModel(snapshot: AuthScreenSnapshot): AuthScreenModel {
  const {
    sessionStatus,
    sessionProvider,
    sessionSubject,
    sessionDisplayName,
    sessionUsername,
    sessionWalletProvider,
    sessionWalletAddress,
    sessionWalletChain,
    sessionIssuedAt,
    sessionExpiresAt,
    rawInitDataPresent,
    telegramAuthAvailable,
    sessionSigningConfigured,
    devLoginAvailable,
    initDataHref,
    platformHref,
    profileHref,
    tonConnectHref,
  } = snapshot;

  const rows = [
    { field: 'sessionStatus', value: { kind: 'text', text: sessionStatus } },
    { field: 'sessionProvider', value: { kind: 'text', text: sessionProvider } },
    { field: 'sessionSubject', value: { kind: 'text', text: sessionSubject } },
    { field: 'sessionDisplayName', value: { kind: 'text', text: sessionDisplayName } },
    { field: 'sessionUsername', value: { kind: 'text', text: sessionUsername } },
    { field: 'sessionWalletProvider', value: { kind: 'text', text: sessionWalletProvider } },
    { field: 'sessionWalletAddress', value: { kind: 'text', text: sessionWalletAddress } },
    { field: 'sessionWalletChain', value: { kind: 'text', text: sessionWalletChain } },
    { field: 'sessionIssuedAt', value: { kind: 'text', text: sessionIssuedAt } },
    { field: 'sessionExpiresAt', value: { kind: 'text', text: sessionExpiresAt } },
  ] as const;

  return {
    sections: [
      {
        id: 'capabilities',
        rows: [
          { field: 'rawInitDataPresent', value: { kind: 'boolean', checked: rawInitDataPresent } },
          {
            field: 'telegramAuthAvailable',
            value: { kind: 'boolean', checked: telegramAuthAvailable },
          },
          {
            field: 'sessionSigningConfigured',
            value: { kind: 'boolean', checked: sessionSigningConfigured },
          },
          { field: 'devLoginAvailable', value: { kind: 'boolean', checked: devLoginAvailable } },
        ],
      },
      {
        id: 'session',
        rows: rows.map((row) => ({ field: row.field, value: row.value })),
      },
      {
        id: 'links',
        rows: [
          { field: 'initData', value: { kind: 'link', href: initDataHref } },
          { field: 'platform', value: { kind: 'link', href: platformHref } },
          { field: 'profile', value: { kind: 'link', href: profileHref } },
          { field: 'tonConnect', value: { kind: 'link', href: tonConnectHref } },
        ],
      },
    ],
  };
}