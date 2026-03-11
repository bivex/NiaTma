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
  const response = await fetch('/api/platform-demo', {
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch platform server state: ${response.status}`);
  }

  const payload = (await response.json()) as PlatformServerStateDto;

  return mapPlatformServerStateDto(payload);
}