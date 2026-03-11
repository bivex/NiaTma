import type { DisplayDataRow } from '@/shared/domain/display-data';

import type {
  InitDataScreenModel,
  InitDataSnapshot,
  LaunchParamsSnapshot,
  ThemeParamsSnapshot,
} from '../domain/models';

function toText(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return JSON.stringify(value);
}

function mapPrimitiveRow(title: string, value: unknown): DisplayDataRow {
  if (typeof value === 'boolean') {
    return { title, value: { kind: 'boolean', checked: value } };
  }

  return { title, value: { kind: 'text', text: toText(value) } };
}

function mapRecordRows(record: Record<string, unknown>): DisplayDataRow[] {
  return Object.entries(record).map(([title, value]) => mapPrimitiveRow(title, value));
}

function formatThemeParamName(title: string) {
  return title.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`).replace(/background/, 'bg');
}

export function buildInitDataScreenModel(
  snapshot: InitDataSnapshot,
): InitDataScreenModel {
  if (!snapshot.raw || !snapshot.state) {
    return { status: 'missing' };
  }

  const rootRows: DisplayDataRow[] = [
    { title: 'raw', value: { kind: 'text', text: snapshot.raw } },
    ...Object.entries(snapshot.state).reduce<DisplayDataRow[]>((acc, [title, value]) => {
      if (value instanceof Date || !value || typeof value !== 'object') {
        acc.push(mapPrimitiveRow(title, value));
      }
      return acc;
    }, []),
  ];

  const sections = [{ header: 'Init Data', rows: rootRows }];

  if (snapshot.user) {
    sections.push({ header: 'User', rows: mapRecordRows(snapshot.user) });
  }
  if (snapshot.receiver) {
    sections.push({ header: 'Receiver', rows: mapRecordRows(snapshot.receiver) });
  }
  if (snapshot.chat) {
    sections.push({ header: 'Chat', rows: mapRecordRows(snapshot.chat) });
  }

  return { status: 'ready', sections };
}

export function buildLaunchParamsRows(
  snapshot: LaunchParamsSnapshot,
): DisplayDataRow[] {
  return [
    mapPrimitiveRow('tgWebAppPlatform', snapshot.platform),
    mapPrimitiveRow('tgWebAppShowSettings', snapshot.showSettings),
    mapPrimitiveRow('tgWebAppVersion', snapshot.version),
    mapPrimitiveRow('tgWebAppBotInline', snapshot.botInline),
    mapPrimitiveRow('tgWebAppStartParam', snapshot.startParam),
    { title: 'tgWebAppData', value: { kind: 'link', href: '/init-data', label: 'Open' } },
    {
      title: 'tgWebAppThemeParams',
      value: { kind: 'link', href: '/theme-params', label: 'Open' },
    },
  ];
}

export function buildThemeParamsRows(
  snapshot: ThemeParamsSnapshot,
): DisplayDataRow[] {
  return Object.entries(snapshot).map(([title, value]) => ({
    title: formatThemeParamName(title),
    value: { kind: 'color', color: value },
  }));
}