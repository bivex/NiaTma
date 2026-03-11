import type { DisplayDataRow } from '@/shared/domain/display-data';

export interface DisplaySection {
  header: string;
  rows: DisplayDataRow[];
}

export interface InitDataSnapshot {
  raw?: string;
  state?: Record<string, unknown>;
  user?: Record<string, unknown>;
  receiver?: Record<string, unknown>;
  chat?: Record<string, unknown>;
}

export interface LaunchParamsSnapshot {
  platform?: string;
  showSettings?: boolean;
  version?: string;
  botInline?: boolean;
  startParam?: string;
}

export type ThemeParamsSnapshot = Record<string, string>;

export type InitDataScreenModel =
  | { status: 'missing' }
  | { status: 'ready'; sections: DisplaySection[] };