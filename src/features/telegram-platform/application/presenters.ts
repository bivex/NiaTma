import type { PlatformScreenModel, PlatformSnapshot } from '../domain/models';

export function buildPlatformScreenModel(snapshot: PlatformSnapshot): PlatformScreenModel {
  return {
    sections: [
      {
        id: 'runtime',
        rows: [
          { field: 'appName', value: { kind: 'text', text: snapshot.appName } },
          { field: 'environment', value: { kind: 'text', text: snapshot.environment } },
          { field: 'platform', value: { kind: 'text', text: snapshot.platform } },
          { field: 'version', value: { kind: 'text', text: snapshot.version } },
          { field: 'locale', value: { kind: 'text', text: snapshot.locale } },
          { field: 'appearance', value: { kind: 'text', text: snapshot.appearance } },
        ],
      },
      {
        id: 'telegramUx',
        rows: [
          { field: 'mainButtonMounted', value: { kind: 'boolean', checked: snapshot.mainButtonMounted } },
          { field: 'mainButtonVisible', value: { kind: 'boolean', checked: snapshot.mainButtonVisible } },
          { field: 'mainButtonText', value: { kind: 'text', text: snapshot.mainButtonText } },
          { field: 'hapticsSupported', value: { kind: 'boolean', checked: snapshot.hapticsSupported } },
          {
            field: 'verticalSwipeSupported',
            value: { kind: 'boolean', checked: snapshot.verticalSwipeSupported },
          },
          {
            field: 'verticalSwipeEnabled',
            value: { kind: 'boolean', checked: snapshot.verticalSwipeEnabled },
          },
          { field: 'swipeBackEnabled', value: { kind: 'boolean', checked: snapshot.swipeBackEnabled } },
        ],
      },
      {
        id: 'links',
        rows: [
          {
            field: 'applicationDiagnostics',
            value: { kind: 'link', href: snapshot.applicationDiagnosticsHref },
          },
          { field: 'tonConnect', value: { kind: 'link', href: snapshot.tonConnectHref } },
        ],
      },
    ],
  };
}