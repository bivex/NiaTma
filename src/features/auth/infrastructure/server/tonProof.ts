import {
  Address,
  Cell,
  contractAddress,
  loadStateInit,
  WalletContractV1R1,
  WalletContractV1R2,
  WalletContractV1R3,
  WalletContractV2R1,
  WalletContractV2R2,
  WalletContractV3R1,
  WalletContractV3R2,
  WalletContractV4,
  WalletContractV5Beta,
  WalletContractV5R1,
} from '@ton/ton';
import { sha256, signVerify } from '@ton/crypto';

import type { VerifyAuthTonProofInput } from '../../domain/models';

const tonProofPrefix = Buffer.from('ton-proof-item-v2/');
const tonConnectPrefix = Buffer.from('ton-connect');
const zeroPublicKey = Buffer.alloc(32);

type WalletParser = {
  codeHash: string;
  readPublicKey: (stateInit: ReturnType<typeof loadStateInit>) => Buffer;
};

function readText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return undefined;
  const nextValue = value.trim();
  return nextValue && nextValue.length <= maxLength ? nextValue : undefined;
}

function readNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function createWalletCodeHash(factory: () => { init: { code: Cell } }) {
  return factory().init.code.hash().toString('hex');
}

const walletParsers: WalletParser[] = [
  {
    codeHash: createWalletCodeHash(() => WalletContractV1R1.create({ workchain: 0, publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(32).loadBuffer(32) ?? zeroPublicKey,
  },
  {
    codeHash: createWalletCodeHash(() => WalletContractV1R2.create({ workchain: 0, publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(32).loadBuffer(32) ?? zeroPublicKey,
  },
  {
    codeHash: createWalletCodeHash(() => WalletContractV1R3.create({ workchain: 0, publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(32).loadBuffer(32) ?? zeroPublicKey,
  },
  {
    codeHash: createWalletCodeHash(() => WalletContractV2R1.create({ workchain: 0, publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(32).loadBuffer(32) ?? zeroPublicKey,
  },
  {
    codeHash: createWalletCodeHash(() => WalletContractV2R2.create({ workchain: 0, publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(32).loadBuffer(32) ?? zeroPublicKey,
  },
  {
    codeHash: createWalletCodeHash(() => WalletContractV3R1.create({ workchain: 0, publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(64).loadBuffer(32) ?? zeroPublicKey,
  },
  {
    codeHash: createWalletCodeHash(() => WalletContractV3R2.create({ workchain: 0, publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(64).loadBuffer(32) ?? zeroPublicKey,
  },
  {
    codeHash: createWalletCodeHash(() => WalletContractV4.create({ workchain: 0, publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(64).loadBuffer(32) ?? zeroPublicKey,
  },
  {
    codeHash: createWalletCodeHash(() => WalletContractV5Beta.create({ publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(113).loadBuffer(32) ?? zeroPublicKey,
  },
  {
    codeHash: createWalletCodeHash(() => WalletContractV5R1.create({ workchain: 0, publicKey: zeroPublicKey })),
    readPublicKey: (stateInit) => stateInit.data?.beginParse().skip(65).loadBuffer(32) ?? zeroPublicKey,
  },
];

export function parseVerifyAuthTonProofInput(value: unknown): VerifyAuthTonProofInput | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const input = value as Record<string, unknown>;
  const proof = input.proof as Record<string, unknown> | undefined;
  const domain = proof?.domain as Record<string, unknown> | undefined;
  const address = readText(input.address, 256);
  const publicKey = readText(input.publicKey, 128);
  const walletStateInit = readText(input.walletStateInit, 8_192);
  const payload = readText(proof?.payload, 256);
  const signature = readText(proof?.signature, 512);
  const domainValue = readText(domain?.value, 255);
  const timestamp = readNumber(proof?.timestamp);
  const lengthBytes = readNumber(domain?.lengthBytes);

  if (!address || !publicKey || !walletStateInit || !payload || !signature || !domainValue) {
    return undefined;
  }

  if (timestamp === undefined || lengthBytes === undefined) {
    return undefined;
  }

  return {
    address,
    chain: readText(input.chain, 64),
    publicKey,
    walletStateInit,
    provider: readText(input.provider, 128),
    proof: {
      timestamp,
      domain: {
        lengthBytes,
        value: domainValue,
      },
      payload,
      signature,
    },
  };
}

function extractStandardWalletPublicKey(stateInit: ReturnType<typeof loadStateInit>) {
  const codeHash = stateInit.code?.hash().toString('hex');
  const parser = walletParsers.find((candidate) => candidate.codeHash === codeHash);

  if (!parser || !stateInit.data) {
    return undefined;
  }

  return parser.readPublicKey(stateInit);
}

export async function buildTonProofDigest(options: {
  address: Address;
  domain: string;
  payload: string;
  timestamp: number;
}) {
  const workchain = Buffer.alloc(4);
  workchain.writeInt32BE(options.address.workChain, 0);

  const domainLength = Buffer.alloc(4);
  domainLength.writeUInt32LE(Buffer.byteLength(options.domain), 0);

  const timestamp = Buffer.alloc(8);
  timestamp.writeBigUInt64LE(BigInt(options.timestamp), 0);

  const message = Buffer.concat([
    tonProofPrefix,
    workchain,
    options.address.hash,
    domainLength,
    Buffer.from(options.domain),
    timestamp,
    Buffer.from(options.payload),
  ]);
  const messageHash = Buffer.from(await sha256(message));

  return Buffer.from(await sha256(Buffer.concat([Buffer.from([0xff, 0xff]), tonConnectPrefix, messageHash])));
}

export async function verifyAuthTonProof(
  input: VerifyAuthTonProofInput,
  options: {
    expectedDomain: string;
    maxAgeSeconds: number;
    consumePayload: (payload: string, nowMs?: number) => boolean;
    nowMs?: number;
  },
): Promise<boolean> {
  try {
    const nowMs = options.nowMs ?? Date.now();
    const nowSeconds = Math.floor(nowMs / 1000);
    const expectedDomainLength = Buffer.byteLength(input.proof.domain.value);

    if (input.proof.domain.value !== options.expectedDomain) {
      return false;
    }

    if (input.proof.domain.lengthBytes !== expectedDomainLength) {
      return false;
    }

    if (input.proof.timestamp < nowSeconds - options.maxAgeSeconds || input.proof.timestamp > nowSeconds + 60) {
      return false;
    }

    if (!options.consumePayload(input.proof.payload, nowMs)) {
      return false;
    }

    const address = Address.parse(input.address);
    const stateInit = loadStateInit(Cell.fromBase64(input.walletStateInit).beginParse());
    const publicKey = extractStandardWalletPublicKey(stateInit);

    if (!publicKey) {
      return false;
    }

    if (!Buffer.from(input.publicKey, 'hex').equals(publicKey)) {
      return false;
    }

    const derivedAddress = contractAddress(address.workChain, stateInit);

    if (!derivedAddress.equals(address)) {
      return false;
    }

    return signVerify(
      await buildTonProofDigest({
        address,
        domain: input.proof.domain.value,
        payload: input.proof.payload,
        timestamp: input.proof.timestamp,
      }),
      Buffer.from(input.proof.signature, 'base64'),
      publicKey,
    );
  } catch {
    return false;
  }
}