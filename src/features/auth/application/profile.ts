import type {
  AuthSession,
  AuthUserProfile,
  ProfileScreenModel,
  ProfileScreenSnapshot,
} from '../domain/models';

export function toAuthUserProfile(session: AuthSession): AuthUserProfile {
  const displayName = [session.user.firstName, session.user.lastName].filter(Boolean).join(' ') || undefined;

  return {
    subject: session.sub,
    provider: session.provider,
    userId: session.user.id,
    displayName,
    username: session.user.username,
    languageCode: session.user.languageCode,
    issuedAt: session.issuedAt,
    expiresAt: session.expiresAt,
    wallet: session.wallet,
  };
}

export interface ProfileScreenSnapshotContext {
  authHref: string;
  platformHref: string;
  tonConnectHref: string;
  formatTime: (date: number) => string;
  t: (key: string) => string;
}

export function toProfileScreenSnapshot(
  profile: AuthUserProfile | undefined,
  context: ProfileScreenSnapshotContext,
): ProfileScreenSnapshot {
  const { t, authHref, platformHref, tonConnectHref, formatTime } = context;

  if (!profile) {
    const loading = t('status.loading');
    return {
      subject: loading,
      provider: loading,
      userId: loading,
      displayName: undefined,
      username: undefined,
      languageCode: undefined,
      walletProvider: undefined,
      walletAddress: undefined,
      walletChain: undefined,
      walletPublicKey: undefined,
      walletLinkedAt: undefined,
      issuedAt: loading,
      expiresAt: loading,
      authHref,
      platformHref,
      tonConnectHref,
    };
  }

  const {
    subject,
    provider,
    userId,
    displayName,
    username,
    languageCode,
    wallet,
    issuedAt,
    expiresAt,
  } = profile;

  return {
    subject,
    provider,
    userId,
    displayName,
    username,
    languageCode,
    walletProvider: wallet?.provider,
    walletAddress: wallet?.address,
    walletChain: wallet?.chain,
    walletPublicKey: wallet?.publicKey,
    walletLinkedAt: wallet ? formatTime(wallet.linkedAt) : undefined,
    issuedAt: formatTime(issuedAt),
    expiresAt: formatTime(expiresAt),
    authHref,
    platformHref,
    tonConnectHref,
  };
}

export function buildProfileScreenModel(snapshot: ProfileScreenSnapshot): ProfileScreenModel {
  const {
    subject,
    provider,
    userId,
    displayName,
    username,
    languageCode,
    walletProvider,
    walletAddress,
    walletChain,
    walletPublicKey,
    walletLinkedAt,
    issuedAt,
    expiresAt,
    authHref,
    tonConnectHref,
    platformHref,
  } = snapshot;

  const sections: ProfileScreenModel['sections'] = [
    {
      id: 'identity',
      rows: [
        { field: 'subject', value: { kind: 'text', text: subject } },
        { field: 'provider', value: { kind: 'text', text: provider } },
        { field: 'userId', value: { kind: 'text', text: userId } },
        { field: 'displayName', value: { kind: 'text', text: displayName } },
        { field: 'username', value: { kind: 'text', text: username } },
        { field: 'languageCode', value: { kind: 'text', text: languageCode } },
      ],
    },
  ];

  const hasWalletInfo = [
    walletProvider,
    walletAddress,
    walletChain,
    walletPublicKey,
    walletLinkedAt,
  ].some(Boolean);

  if (hasWalletInfo) {
    sections.push({
      id: 'wallet',
      rows: [
        { field: 'walletProvider', value: { kind: 'text', text: walletProvider } },
        { field: 'walletAddress', value: { kind: 'text', text: walletAddress } },
        { field: 'walletChain', value: { kind: 'text', text: walletChain } },
        { field: 'walletPublicKey', value: { kind: 'text', text: walletPublicKey } },
        { field: 'walletLinkedAt', value: { kind: 'text', text: walletLinkedAt } },
      ],
    });
  }

  sections.push(
    {
      id: 'session',
      rows: [
        { field: 'issuedAt', value: { kind: 'text', text: issuedAt } },
        { field: 'expiresAt', value: { kind: 'text', text: expiresAt } },
      ],
    },
    {
      id: 'links',
      rows: [
        { field: 'auth', value: { kind: 'link', href: authHref } },
        { field: 'tonConnect', value: { kind: 'link', href: tonConnectHref } },
        { field: 'platform', value: { kind: 'link', href: platformHref } },
      ],
    },
  );

  return {
    sections,
  };
}