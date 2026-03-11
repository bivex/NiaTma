import { routePaths } from '@/features/navigation/domain/routes';

export function resolvePostAuthPath(value: string | null | undefined): string | undefined {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return undefined;
  }

  if (value === routePaths.auth) {
    return undefined;
  }

  return value;
}

export function buildAuthRedirectPath(nextPath: string): string {
  const safeNextPath = resolvePostAuthPath(nextPath);

  if (!safeNextPath) {
    return routePaths.auth;
  }

  return `${routePaths.auth}?next=${encodeURIComponent(safeNextPath)}`;
}