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

  if (
    snapshot.walletProvider ||
    snapshot.walletAddress ||
    snapshot.walletChain ||
    snapshot.walletPublicKey ||
    snapshot.walletLinkedAt
  ) {
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