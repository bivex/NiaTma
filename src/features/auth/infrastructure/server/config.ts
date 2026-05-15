import { parseEnvBoolean } from '@/shared/lib/env';

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

export function createAuthConfig(env: Record<string, string | undefined> = process.env): AuthConfig {
  const isProduction = env.NODE_ENV === 'production';
  const sessionSecret = env.AUTH_SESSION_SECRET || (!isProduction ? 'nia-dev-session-secret' : undefined);

  return {
    telegramBotToken: env.TELEGRAM_BOT_TOKEN,
    sessionSecret,
    allowDevLogin: parseEnvBoolean(env.AUTH_ALLOW_DEV_LOGIN, !isProduction),
    sessionTtlSeconds: Number(env.AUTH_SESSION_TTL_SECONDS || 60 * 60 * 24 * 7),
    initDataMaxAgeSeconds: Number(env.AUTH_TELEGRAM_MAX_AGE_SECONDS || 60 * 60 * 24),
    tonProofMaxAgeSeconds: Number(env.AUTH_TON_PROOF_MAX_AGE_SECONDS || 60 * 15),
    tonProofPayloadTtlSeconds: Number(env.AUTH_TON_PROOF_PAYLOAD_TTL_SECONDS || 60 * 5),
    secureCookies: isProduction,
  };
}

export interface AuthCapabilities {
  telegramAuthAvailable: boolean;
  sessionSigningConfigured: boolean;
  devLoginAvailable: boolean;
}

export function getAuthCapabilities(config: AuthConfig): AuthCapabilities {
  const sessionSigningConfigured = Boolean(config.sessionSecret);

  return {
    sessionSigningConfigured,
    telegramAuthAvailable: sessionSigningConfigured && Boolean(config.telegramBotToken),
    devLoginAvailable: sessionSigningConfigured && config.allowDevLogin,
  };
}