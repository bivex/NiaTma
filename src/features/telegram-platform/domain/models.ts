import type { DisplayDataValue } from '@/shared/domain/display-data';

export type PlatformSectionId = 'runtime' | 'state' | 'telegramUx' | 'links';

export type PlatformNoticeId =
  | 'idle'
  | 'mainButton'
  | 'impact'
  | 'success'
  | 'selection'
  | 'skeleton'
  | 'verticalSwipeEnabled'
  | 'verticalSwipeDisabled'
  | 'unsupported';

export type PlatformFieldId =
  | 'appName'
  | 'environment'
  | 'platform'
  | 'version'
  | 'locale'
  | 'appearance'
  | 'stateLibrary'
  | 'notice'
  | 'skeletonVisible'
  | 'mainActionLoading'
  | 'allowVerticalSwipeRequested'
  | 'mainButtonMounted'
  | 'mainButtonVisible'
  | 'mainButtonText'
  | 'hapticsSupported'
  | 'verticalSwipeSupported'
  | 'verticalSwipeEnabled'
  | 'swipeBackEnabled'
  | 'applicationDiagnostics'
  | 'tonConnect';

export interface PlatformRow {
  field: PlatformFieldId;
  value: DisplayDataValue;
}

export interface PlatformSection {
  id: PlatformSectionId;
  rows: PlatformRow[];
}

export interface PlatformScreenModel {
  sections: PlatformSection[];
}

export interface PlatformSnapshot {
  appName: string;
  environment: string;
  platform: string;
  version: string;
  locale: string;
  appearance: string;
  stateLibrary: string;
  notice: string;
  skeletonVisible: boolean;
  mainActionLoading: boolean;
  allowVerticalSwipeRequested: boolean;
  mainButtonMounted: boolean;
  mainButtonVisible: boolean;
  mainButtonText?: string;
  hapticsSupported: boolean;
  verticalSwipeSupported: boolean;
  verticalSwipeEnabled: boolean;
  swipeBackEnabled: boolean;
  applicationDiagnosticsHref: string;
  tonConnectHref: string;
}