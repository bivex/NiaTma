export interface AuthConfig {
  telegramBotToken?: string;
  sessionSecret?: string;
  allowDevLogin: boolean;
  sessionTtlSeconds: number;
  initDataMaxAgeSeconds: number;
  tonProofMaxAgeSeconds: number;
  tonProofPayloadTtlSeconds: number;
  secureCookies: boolean;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

export function createAuthConfig(env: Record<string, string | undefined> = process.env): AuthConfig {
  const isProduction = env.NODE_ENV === 'production';
  const sessionSecret = env.AUTH_SESSION_SECRET || (!isProduction ? 'nia-dev-session-secret' : undefined);

  return {
    telegramBotToken: env.TELEGRAM_BOT_TOKEN,
    sessionSecret,
    allowDevLogin: parseBoolean(env.AUTH_ALLOW_DEV_LOGIN, !isProduction),
    sessionTtlSeconds: Number(env.AUTH_SESSION_TTL_SECONDS || 60 * 60 * 24 * 7),
    initDataMaxAgeSeconds: Number(env.AUTH_TELEGRAM_MAX_AGE_SECONDS || 60 * 60 * 24),
    tonProofMaxAgeSeconds: Number(env.AUTH_TON_PROOF_MAX_AGE_SECONDS || 60 * 15),
    tonProofPayloadTtlSeconds: Number(env.AUTH_TON_PROOF_PAYLOAD_TTL_SECONDS || 60 * 5),
    secureCookies: isProduction,
  };
}

export function canSignSessions(config: AuthConfig): boolean {
  return Boolean(config.sessionSecret);
}

export function canUseTelegramAuth(config: AuthConfig): boolean {
  return Boolean(config.sessionSecret && config.telegramBotToken);
}

export function canUseDevLogin(config: AuthConfig): boolean {
  return Boolean(config.sessionSecret && config.allowDevLogin);
}