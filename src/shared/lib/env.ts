export type BooleanEnvValue =
  | typeof BOOLEAN_TRUE
  | typeof BOOLEAN_FALSE
  | typeof BOOLEAN_YES
  | typeof BOOLEAN_NO
  | typeof BOOLEAN_ON
  | typeof BOOLEAN_OFF
  | typeof NUMERIC_TRUE
  | typeof NUMERIC_FALSE;

const BOOLEAN_TRUE = 'true' as const;
const BOOLEAN_FALSE = 'false' as const;
const BOOLEAN_YES = 'yes' as const;
const BOOLEAN_NO = 'no' as const;
const BOOLEAN_ON = 'on' as const;
const BOOLEAN_OFF = 'off' as const;
const NUMERIC_TRUE = '1' as const;
const NUMERIC_FALSE = '0' as const;

const TRUTHY_VALUES: ReadonlySet<BooleanEnvValue> = new Set([
  BOOLEAN_TRUE,
  BOOLEAN_YES,
  BOOLEAN_ON,
  NUMERIC_TRUE,
]);
const FALSY_VALUES: ReadonlySet<BooleanEnvValue> = new Set([
  BOOLEAN_FALSE,
  BOOLEAN_NO,
  BOOLEAN_OFF,
  NUMERIC_FALSE,
]);

/**
 * Parses a boolean value from a string, supporting multiple truthy/falsy representations.
 * Useful for environment variables.
 */
export function parseEnvBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase() as BooleanEnvValue;
  if (TRUTHY_VALUES.has(normalized)) {
    return true;
  }
  if (FALSY_VALUES.has(normalized)) {
    return false;
  }

  return fallback;
}
