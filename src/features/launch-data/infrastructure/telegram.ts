'use client';

import {
  initData,
  themeParams,
  useLaunchParams,
  useRawInitData,
  useSignal,
} from '@tma.js/sdk-react';

import type {
  InitDataSnapshot,
  LaunchParamsSnapshot,
  ThemeParamsSnapshot,
} from '../domain/models';

function toRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;
}

function toThemeParamsRecord(value: unknown): ThemeParamsSnapshot {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}

export function useInitDataSnapshot(): InitDataSnapshot {
  const raw = useRawInitData();
  const state = useSignal(initData.state);

  return {
    raw: raw || undefined,
    state: state ? (state as unknown as Record<string, unknown>) : undefined,
    user: toRecord(state?.user),
    receiver: toRecord(state?.receiver),
    chat: toRecord(state?.chat),
  };
}

export function useLaunchParamsSnapshot(): LaunchParamsSnapshot {
  const launchParams = useLaunchParams();

  return {
    platform: launchParams.tgWebAppPlatform,
    showSettings: launchParams.tgWebAppShowSettings,
    version: launchParams.tgWebAppVersion,
    botInline: launchParams.tgWebAppBotInline,
    startParam: launchParams.tgWebAppStartParam,
  };
}

export function useThemeParamsSnapshot(): ThemeParamsSnapshot {
  const launchParams = useLaunchParams();
  const currentThemeParams = useSignal(themeParams.state);

  const themeParamsState = currentThemeParams && Object.keys(currentThemeParams).length > 0
    ? currentThemeParams
    : launchParams.tgWebAppThemeParams || {};

  return toThemeParamsRecord(themeParamsState);
}