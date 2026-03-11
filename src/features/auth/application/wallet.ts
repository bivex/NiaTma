import type { AuthLinkedWallet, AuthLinkedWalletInput } from '../domain/models';

function readText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const nextValue = value.trim();
  if (!nextValue || nextValue.length > maxLength) {
    return undefined;
  }

  return nextValue;
}

export function parseAuthLinkedWalletInput(value: unknown): AuthLinkedWalletInput | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const input = value as Record<string, unknown>;
  const address = readText(input.address, 256);

  if (!address) {
    return undefined;
  }

  return {
    address,
    chain: readText(input.chain, 64),
    publicKey: readText(input.publicKey, 256),
    provider: readText(input.provider, 128),
  };
}

export function createAuthLinkedWallet(
  input: AuthLinkedWalletInput,
  options: { linkedAt?: number; verifiedAt?: number } = {},
): AuthLinkedWallet {
  return {
    ...input,
    linkedAt: options.linkedAt ?? Date.now(),
    verifiedAt: options.verifiedAt,
  };
}