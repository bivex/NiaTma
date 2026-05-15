import { ApiError } from '@/shared/lib/errors';

export interface PlatformServerStateDto {
  appName: string;
  serverTime: string;
  runtime: string;
  path: string;
}

export interface PlatformServerState {
  appName: string;
  serverTime: string;
  runtime: string;
  path: string;
}

export const platformServerStateQueryKey = ['platform', 'server-state'] as const;

export function mapPlatformServerStateDto(dto: PlatformServerStateDto): PlatformServerState {
  return {
    appName: dto.appName,
    serverTime: dto.serverTime,
    runtime: dto.runtime,
    path: dto.path,
  };
}

export async function fetchPlatformServerState(): Promise<PlatformServerState> {
  let response: Response;
  try {
    response = await fetch('/api/platform-demo', {
      headers: { accept: 'application/json' },
    });
  } catch (error) {
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Request failed'}`);
  }

  if (!response.ok) {
    throw new ApiError(`Unable to fetch platform server state: ${response.status}`, response.status);
  }

  const payload = (await response.json()) as PlatformServerStateDto;
  return mapPlatformServerStateDto(payload);
}

