import { getSecureRandomBytes } from '@ton/crypto';

import type { AuthTonProofPayload } from '../../domain/models';

type TonProofPayloadEntry = { expiresAt: number };

declare global {
  var __niaTonProofPayloadStore: Map<string, TonProofPayloadEntry> | undefined;
}

function getTonProofPayloadStore() {
  globalThis.__niaTonProofPayloadStore ??= new Map<string, TonProofPayloadEntry>();
  return globalThis.__niaTonProofPayloadStore;
}

function pruneExpiredPayloads(nowMs: number) {
  const store = getTonProofPayloadStore();

  for (const [payload, entry] of store.entries()) {
    if (entry.expiresAt <= nowMs) {
      store.delete(payload);
    }
  }
}

export async function issueTonProofPayload(
  ttlSeconds: number,
  nowMs = Date.now(),
): Promise<AuthTonProofPayload> {
  pruneExpiredPayloads(nowMs);
  const payload = Buffer.from(await getSecureRandomBytes(32)).toString('hex');
  const expiresAt = nowMs + ttlSeconds * 1000;

  getTonProofPayloadStore().set(payload, { expiresAt });

  return { payload, expiresAt };
}

export function consumeTonProofPayload(payload: string, nowMs = Date.now()): boolean {
  pruneExpiredPayloads(nowMs);
  const store = getTonProofPayloadStore();
  const entry = store.get(payload);

  if (!entry || entry.expiresAt <= nowMs) {
    store.delete(payload);
    return false;
  }

  store.delete(payload);
  return true;
}