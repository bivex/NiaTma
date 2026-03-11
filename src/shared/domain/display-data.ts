export type DisplayDataValue =
  | { kind: 'text'; text?: string }
  | { kind: 'boolean'; checked: boolean }
  | { kind: 'link'; href?: string; label?: string }
  | { kind: 'color'; color: string };

export interface DisplayDataRow {
  title: string;
  value: DisplayDataValue;
}