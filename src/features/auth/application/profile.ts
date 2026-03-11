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
  };
}

export function buildProfileScreenModel(snapshot: ProfileScreenSnapshot): ProfileScreenModel {
  return {
    sections: [
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
          { field: 'platform', value: { kind: 'link', href: snapshot.platformHref } },
        ],
      },
    ],
  };
}