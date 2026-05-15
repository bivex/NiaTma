import type { PlatformScreenModel, PlatformSnapshot } from '../domain/models';

export function buildPlatformScreenModel(snapshot: PlatformSnapshot): PlatformScreenModel {
  const {
    appName,
    environment,
    platform,
    version,
    locale,
    appearance,
    stateLibrary,
    notice,
    skeletonVisible,
    mainActionLoading,
    allowVerticalSwipeRequested,
    queryLibrary,
    queryStatus,
    queryFetchStatus,
    queryUpdatedAt,
    serverTime,
    serverRuntime,
    serverPath,
    mainButtonMounted,
    mainButtonVisible,
    mainButtonText,
    hapticsSupported,
    verticalSwipeSupported,
    verticalSwipeEnabled,
    swipeBackEnabled,
    applicationDiagnosticsHref,
    tonConnectHref,
  } = snapshot;

  return {
    sections: [
      {
        id: 'runtime',
        rows: [
          { field: 'appName', value: { kind: 'text', text: appName } },
          { field: 'environment', value: { kind: 'text', text: environment } },
          { field: 'platform', value: { kind: 'text', text: platform } },
          { field: 'version', value: { kind: 'text', text: version } },
          { field: 'locale', value: { kind: 'text', text: locale } },
          { field: 'appearance', value: { kind: 'text', text: appearance } },
        ],
      },
      {
        id: 'state',
        rows: [
          { field: 'stateLibrary', value: { kind: 'text', text: stateLibrary } },
          { field: 'notice', value: { kind: 'text', text: notice } },
          {
            field: 'skeletonVisible',
            value: { kind: 'boolean', checked: skeletonVisible },
          },
          {
            field: 'mainActionLoading',
            value: { kind: 'boolean', checked: mainActionLoading },
          },
          {
            field: 'allowVerticalSwipeRequested',
            value: { kind: 'boolean', checked: allowVerticalSwipeRequested },
          },
        ],
      },
      {
        id: 'serverState',
        rows: [
          { field: 'queryLibrary', value: { kind: 'text', text: queryLibrary } },
          { field: 'queryStatus', value: { kind: 'text', text: queryStatus } },
          { field: 'queryFetchStatus', value: { kind: 'text', text: queryFetchStatus } },
          { field: 'queryUpdatedAt', value: { kind: 'text', text: queryUpdatedAt } },
          { field: 'serverTime', value: { kind: 'text', text: serverTime } },
          { field: 'serverRuntime', value: { kind: 'text', text: serverRuntime } },
          { field: 'serverPath', value: { kind: 'text', text: serverPath } },
        ],
      },
      {
        id: 'telegramUx',
        rows: [
          { field: 'mainButtonMounted', value: { kind: 'boolean', checked: mainButtonMounted } },
          { field: 'mainButtonVisible', value: { kind: 'boolean', checked: mainButtonVisible } },
          { field: 'mainButtonText', value: { kind: 'text', text: mainButtonText } },
          { field: 'hapticsSupported', value: { kind: 'boolean', checked: hapticsSupported } },
          {
            field: 'verticalSwipeSupported',
            value: { kind: 'boolean', checked: verticalSwipeSupported },
          },
          {
            field: 'verticalSwipeEnabled',
            value: { kind: 'boolean', checked: verticalSwipeEnabled },
          },
          { field: 'swipeBackEnabled', value: { kind: 'boolean', checked: swipeBackEnabled } },
        ],
      },
      {
        id: 'links',
        rows: [
          {
            field: 'applicationDiagnostics',
            value: { kind: 'link', href: applicationDiagnosticsHref },
          },
          { field: 'tonConnect', value: { kind: 'link', href: tonConnectHref } },
        ],
      },
    ],
  };
}