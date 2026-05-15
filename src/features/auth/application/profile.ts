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
  if (!profile) {
    return {
      subject: context.t('status.loading'),
      provider: context.t('status.loading'),
      userId: context.t('status.loading'),
      displayName: undefined,
      username: undefined,
      languageCode: undefined,
      walletProvider: undefined,
      walletAddress: undefined,
      walletChain: undefined,
      walletPublicKey: undefined,
      walletLinkedAt: undefined,
      issuedAt: context.t('status.loading'),
      expiresAt: context.t('status.loading'),
      authHref: context.authHref,
      platformHref: context.platformHref,
      tonConnectHref: context.tonConnectHref,
    };
  }

  return {
    subject: profile.subject,
    provider: profile.provider,
    userId: profile.userId,
    displayName: profile.displayName,
    username: profile.username,
    languageCode: profile.languageCode,
    walletProvider: profile.wallet?.provider,
    walletAddress: profile.wallet?.address,
    walletChain: profile.wallet?.chain,
    walletPublicKey: profile.wallet?.publicKey,
    walletLinkedAt: profile.wallet ? context.formatTime(profile.wallet.linkedAt) : undefined,
    issuedAt: context.formatTime(profile.issuedAt),
    expiresAt: context.formatTime(profile.expiresAt),
    authHref: context.authHref,
    platformHref: context.platformHref,
    tonConnectHref: context.tonConnectHref,
  };
}

export function buildProfileScreenModel(snapshot: ProfileScreenSnapshot): ProfileScreenModel {
  const sections: ProfileScreenModel['sections'] = [
    {
      id: 'identity',
      rows: [
        { field: 'subject', value: { kind: 'text', text: snapshot.subject } },
        { field: 'provider', value: { kind: 'text', text: snapshot.provider } },
        { field: 'userId', value: { kind: 'text', text: snapshot.userId } },
        { field: 'displayName', value: { kind: 'text', text: snapshot.displayName } },
        { field: 'username', value: { kind: 'text', text: snapshot.username } },
        { field: 'languageCode', value: { kind: 'text', text: snapshot.languageCode } },
      ],
    },
  ];

  const hasWalletInfo = [
    snapshot.walletProvider,
    snapshot.walletAddress,
    snapshot.walletChain,
    snapshot.walletPublicKey,
    snapshot.walletLinkedAt,
  ].some(Boolean);

  if (hasWalletInfo) {
    sections.push({
      id: 'wallet',
      rows: [
        { field: 'walletProvider', value: { kind: 'text', text: snapshot.walletProvider } },
        { field: 'walletAddress', value: { kind: 'text', text: snapshot.walletAddress } },
        { field: 'walletChain', value: { kind: 'text', text: snapshot.walletChain } },
        { field: 'walletPublicKey', value: { kind: 'text', text: snapshot.walletPublicKey } },
        { field: 'walletLinkedAt', value: { kind: 'text', text: snapshot.walletLinkedAt } },
      ],
    });
  }

  sections.push(
    {
      id: 'session',
      rows: [
        { field: 'issuedAt', value: { kind: 'text', text: snapshot.issuedAt } },
        { field: 'expiresAt', value: { kind: 'text', text: snapshot.expiresAt } },
      ],
    },
    {
      id: 'links',
      rows: [
        { field: 'auth', value: { kind: 'link', href: snapshot.authHref } },
        { field: 'tonConnect', value: { kind: 'link', href: snapshot.tonConnectHref } },
        { field: 'platform', value: { kind: 'link', href: snapshot.platformHref } },
      ],
    },
  );

  return {
    sections,
  };
}