import type { AuthScreenModel, AuthScreenSnapshot } from '../domain/models';

export function buildAuthScreenModel(snapshot: AuthScreenSnapshot): AuthScreenModel {
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
        rows: [
          { field: 'sessionStatus', value: { kind: 'text', text: snapshot.sessionStatus } },
          { field: 'sessionProvider', value: { kind: 'text', text: snapshot.sessionProvider } },
          { field: 'sessionSubject', value: { kind: 'text', text: snapshot.sessionSubject } },
          { field: 'sessionDisplayName', value: { kind: 'text', text: snapshot.sessionDisplayName } },
          { field: 'sessionUsername', value: { kind: 'text', text: snapshot.sessionUsername } },
          { field: 'sessionIssuedAt', value: { kind: 'text', text: snapshot.sessionIssuedAt } },
          { field: 'sessionExpiresAt', value: { kind: 'text', text: snapshot.sessionExpiresAt } },
        ],
      },
      {
        id: 'links',
        rows: [
          { field: 'initData', value: { kind: 'link', href: snapshot.initDataHref } },
          { field: 'platform', value: { kind: 'link', href: snapshot.platformHref } },
          { field: 'profile', value: { kind: 'link', href: snapshot.profileHref } },
        ],
      },
    ],
  };
}