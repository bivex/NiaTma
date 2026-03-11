import { describe, expect, test } from 'bun:test';

import {
  buildInitDataScreenModel,
  buildLaunchParamsRows,
  buildThemeParamsRows,
} from './presenters';

describe('launch-data presenters', () => {
  test('buildLaunchParamsRows creates navigation links', () => {
    const rows = buildLaunchParamsRows({
      platform: 'ios',
      showSettings: true,
      version: '8.0',
      botInline: false,
      startParam: 'debug',
    });

    expect(rows[5]).toEqual({
      title: 'tgWebAppData',
      value: { kind: 'link', href: '/init-data' },
    });
    expect(rows[6]).toEqual({
      title: 'tgWebAppThemeParams',
      value: { kind: 'link', href: '/theme-params' },
    });
  });

  test('buildThemeParamsRows maps theme colors to color values', () => {
    const rows = buildThemeParamsRows({ backgroundColor: '#ffffff' });

    expect(rows).toEqual([
      {
        title: 'bg_color',
        value: { kind: 'color', color: '#ffffff' },
      },
    ]);
  });

  test('buildInitDataScreenModel builds sections from snapshot', () => {
    const screen = buildInitDataScreenModel({
      raw: 'raw-value',
      state: {
        auth_date: '123',
        can_send_after: 10,
        is_premium: true,
        user: { id: 1 },
      },
      user: { id: 1, first_name: 'Vlad' },
    });

    expect(screen.status).toBe('ready');
    if (screen.status === 'ready') {
      expect(screen.sections).toHaveLength(2);
      expect(screen.sections[0]?.id).toBe('initData');
      expect(screen.sections[1]?.id).toBe('user');
    }
  });
});