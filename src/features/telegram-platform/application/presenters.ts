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
        id: 'state',
        rows: [
          { field: 'stateLibrary', value: { kind: 'text', text: snapshot.stateLibrary } },
          { field: 'notice', value: { kind: 'text', text: snapshot.notice } },
          {
            field: 'skeletonVisible',
            value: { kind: 'boolean', checked: snapshot.skeletonVisible },
          },
          {
            field: 'mainActionLoading',
            value: { kind: 'boolean', checked: snapshot.mainActionLoading },
          },
          {
            field: 'allowVerticalSwipeRequested',
            value: { kind: 'boolean', checked: snapshot.allowVerticalSwipeRequested },
          },
        ],
      },
      {
        id: 'serverState',
        rows: [
          { field: 'queryLibrary', value: { kind: 'text', text: snapshot.queryLibrary } },
          { field: 'queryStatus', value: { kind: 'text', text: snapshot.queryStatus } },
          { field: 'queryFetchStatus', value: { kind: 'text', text: snapshot.queryFetchStatus } },
          { field: 'queryUpdatedAt', value: { kind: 'text', text: snapshot.queryUpdatedAt } },
          { field: 'serverTime', value: { kind: 'text', text: snapshot.serverTime } },
          { field: 'serverRuntime', value: { kind: 'text', text: snapshot.serverRuntime } },
          { field: 'serverPath', value: { kind: 'text', text: snapshot.serverPath } },
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