import { describe, expect, test } from 'bun:test';

import { buildPlatformScreenModel } from './presenters';

describe('telegram-platform presenters', () => {
  test('maps runtime and navigation snapshot into display rows', () => {
    const screen = buildPlatformScreenModel({
      appName: 'NiaTma',
      environment: 'development',
      platform: 'tdesktop',
      version: '8.4',
      locale: 'ru',
      appearance: 'dark',
      stateLibrary: 'zustand',
      notice: 'Action completed',
      skeletonVisible: false,
      mainActionLoading: true,
      allowVerticalSwipeRequested: true,
      queryLibrary: '@tanstack/react-query',
      queryStatus: 'success',
      queryFetchStatus: 'idle',
      queryUpdatedAt: '11:45:02',
      serverTime: '2026-03-11T09:45:02.000Z',
      serverRuntime: 'node v22.0.0',
      serverPath: '/api/platform-demo',
      mainButtonMounted: true,
      mainButtonVisible: true,
      mainButtonText: 'Run action',
      hapticsSupported: true,
      verticalSwipeSupported: true,
      verticalSwipeEnabled: false,
      swipeBackEnabled: true,
      applicationDiagnosticsHref: '/application',
      tonConnectHref: '/ton-connect',
    });

    expect(screen.sections[1]?.rows[0]).toEqual({
      field: 'stateLibrary',
      value: { kind: 'text', text: 'zustand' },
    });
    expect(screen.sections[2]?.rows[0]).toEqual({
      field: 'queryLibrary',
      value: { kind: 'text', text: '@tanstack/react-query' },
    });
    expect(screen.sections[3]?.rows[2]).toEqual({
      field: 'mainButtonText',
      value: { kind: 'text', text: 'Run action' },
    });
    expect(screen.sections[4]?.rows[0]).toEqual({
      field: 'applicationDiagnostics',
      value: { kind: 'link', href: '/application' },
    });
  });
});