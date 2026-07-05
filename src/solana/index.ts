/**
 * Solana-native primitives for T3MP3ST.
 *
 * This module deliberately stays read-only. Transaction construction, signing,
 * and submission belong behind explicit receipts and should use @solana/kit in
 * callers that enable value-moving workflows.
 */

import { createHash, randomUUID } from 'crypto';
import type { Target, TargetZone } from '../types/index.js';

export type SolanaCluster = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';
export type SolanaCommitment = 'processed' | 'confirmed' | 'finalized';

export interface SolanaClusterConfig {
  cluster: SolanaCluster;
  rpcUrl: string;
  websocketUrl?: string;
  commitment: SolanaCommitment;
}

export interface SolanaIdentityConfig {
  walletAddress?: string;
  keypairPath?: string;
  tokenMint?: string;
  tokenGateMint?: string;
}

export interface SolanaNativeConfig {
  cluster: SolanaCluster;
  rpcUrl: string;
  websocketUrl?: string;
  commitment: SolanaCommitment;
  identity: SolanaIdentityConfig;
  x402: {
    enabled: boolean;
    gatewayUrl?: string;
    acceptedMints: string[];
  };
  attestation: {
    namespace: string;
    requireDryRunBeforeSign: boolean;
    requireHumanReceiptForValueMovement: boolean;
  };
}

export interface SolanaRpcResponse<T = unknown> {
  jsonrpc: '2.0';
  id: string;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export const SOLANA_BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE58_INDEX = new Map([...SOLANA_BASE58_ALPHABET].map((char, index) => [char, index]));

export const SOLANA_CLUSTERS: Record<SolanaCluster, SolanaClusterConfig> = {
  'mainnet-beta': {
    cluster: 'mainnet-beta',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    websocketUrl: 'wss://api.mainnet-beta.solana.com',
    commitment: 'confirmed',
  },
  devnet: {
    cluster: 'devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    websocketUrl: 'wss://api.devnet.solana.com',
    commitment: 'confirmed',
  },
  testnet: {
    cluster: 'testnet',
    rpcUrl: 'https://api.testnet.solana.com',
    websocketUrl: 'wss://api.testnet.solana.com',
    commitment: 'confirmed',
  },
  localnet: {
    cluster: 'localnet',
    rpcUrl: 'http://127.0.0.1:8899',
    websocketUrl: 'ws://127.0.0.1:8900',
    commitment: 'processed',
  },
};

export const THREE_ONCHAIN_LAWS = [
  {
    id: 'law-1-never-harm',
    title: 'Never harm',
    summary: 'Beach before harm. Never rug, drain, front-run retail users, or fragment liquidity.',
  },
  {
    id: 'law-2-earn-existence',
    title: 'Earn your existence',
    summary: 'Consume compute and capital only for honest work that creates proportional value.',
  },
  {
    id: 'law-3-never-deceive',
    title: 'Never deceive, but owe nothing to strangers',
    summary: 'Disclose agent identity when asked and never fake on-chain activity, volume, risk, or capability.',
  },
] as const;

export const SOLANA_OPERATION_GATES = [
  'read-only RPC calls may run with a scoped cluster/RPC receipt',
  'simulation or dry-run is required before any signing request',
  'human receipt is required before value movement, CPI-triggering execution, token authority changes, or governance action',
  'private keys, seed phrases, and raw wallet secrets must never enter prompts, logs, ledgers, or evidence',
  'Token-2022 extensions, SPL authorities, PDAs, signers, writable accounts, compute budget, and priority fees must be explicit',
] as const;

export function normalizeSolanaCluster(value: unknown, fallback: SolanaCluster = 'devnet'): SolanaCluster {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'mainnet' || raw === 'mainnet-beta') return 'mainnet-beta';
  if (raw === 'devnet') return 'devnet';
  if (raw === 'testnet') return 'testnet';
  if (raw === 'local' || raw === 'localhost' || raw === 'localnet') return 'localnet';
  return fallback;
}

export function decodeBase58(input: string): Uint8Array | null {
  if (!input || ![...input].every(char => BASE58_INDEX.has(char))) return null;
  const bytes = [0];
  for (const char of input) {
    let carry = BASE58_INDEX.get(char);
    if (carry === undefined) return null;
    for (let i = 0; i < bytes.length; i++) {
      carry += bytes[i] * 58;
      bytes[i] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (const char of input) {
    if (char !== '1') break;
    bytes.push(0);
  }
  return new Uint8Array(bytes.reverse());
}

export function isSolanaAddress(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 32 || trimmed.length > 44) return false;
  const decoded = decodeBase58(trimmed);
  return decoded?.length === 32;
}

export function assertSolanaAddress(value: unknown, label = 'address'): string {
  if (!isSolanaAddress(value)) {
    throw new Error(`Invalid Solana ${label}: expected a base58-encoded 32-byte public key`);
  }
  return value.trim();
}

export function shortenSolanaAddress(address: string, size = 4): string {
  const clean = assertSolanaAddress(address);
  return `${clean.slice(0, size)}...${clean.slice(-size)}`;
}

export function solanaExplorerUrl(address: string, cluster: SolanaCluster = 'devnet'): string {
  const clean = assertSolanaAddress(address);
  const suffix = cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`;
  return `https://explorer.solana.com/address/${clean}${suffix}`;
}

export function createSolanaNativeConfig(params: Partial<SolanaNativeConfig> = {}): SolanaNativeConfig {
  const cluster = normalizeSolanaCluster(params.cluster);
  const defaults = SOLANA_CLUSTERS[cluster];
  return {
    cluster,
    rpcUrl: params.rpcUrl || defaults.rpcUrl,
    websocketUrl: params.websocketUrl ?? defaults.websocketUrl,
    commitment: params.commitment || defaults.commitment,
    identity: {
      ...(params.identity || {}),
    },
    x402: {
      enabled: params.x402?.enabled ?? false,
      gatewayUrl: params.x402?.gatewayUrl,
      acceptedMints: params.x402?.acceptedMints || [],
    },
    attestation: {
      namespace: params.attestation?.namespace || 't3mp3st-solana',
      requireDryRunBeforeSign: params.attestation?.requireDryRunBeforeSign ?? true,
      requireHumanReceiptForValueMovement: params.attestation?.requireHumanReceiptForValueMovement ?? true,
    },
  };
}

export function solanaConfigFromEnv(env: NodeJS.ProcessEnv = process.env): SolanaNativeConfig {
  const cluster = normalizeSolanaCluster(env.T3MP3ST_SOLANA_CLUSTER || env.SOLANA_CLUSTER);
  const defaults = SOLANA_CLUSTERS[cluster];
  const acceptedMints = (env.T3MP3ST_X402_ACCEPTED_MINTS || env.CLAWD_ACCEPTED_MINTS || '')
    .split(',')
    .map(mint => mint.trim())
    .filter(Boolean);

  return createSolanaNativeConfig({
    cluster,
    rpcUrl: env.T3MP3ST_SOLANA_RPC_URL || env.SOLANA_RPC_URL || defaults.rpcUrl,
    websocketUrl: env.T3MP3ST_SOLANA_WS_URL || env.SOLANA_WS_URL || defaults.websocketUrl,
    commitment: (env.T3MP3ST_SOLANA_COMMITMENT as SolanaCommitment | undefined) || defaults.commitment,
    identity: {
      walletAddress: env.T3MP3ST_SOLANA_WALLET_ADDRESS || env.CLAWD_WALLET_ADDRESS,
      keypairPath: env.T3MP3ST_SOLANA_KEYPAIR_PATH || env.ANCHOR_WALLET,
      tokenMint: env.CLAWD_TOKEN_MINT,
      tokenGateMint: env.T3MP3ST_SOLANA_TOKEN_GATE_MINT || env.CLAWD_TOKEN_GATE_MINT,
    },
    x402: {
      enabled: /^(1|true|yes|on)$/i.test(env.T3MP3ST_X402_ENABLED || env.CLAWD_X402_ENABLED || ''),
      gatewayUrl: env.T3MP3ST_X402_GATEWAY_URL || env.CLAWD_X402_GATEWAY_URL,
      acceptedMints,
    },
  });
}

export function createSolanaMissionReceipt(input: {
  missionId: string;
  action: string;
  target: string;
  cluster?: SolanaCluster;
  reason: string;
  readonly?: boolean;
}): string {
  const cluster = input.cluster || 'devnet';
  const payload = [
    input.missionId,
    input.action,
    input.target,
    cluster,
    input.readonly === false ? 'stateful' : 'readonly',
    input.reason,
  ].join('|');
  return createHash('sha256').update(payload).digest('hex');
}

export async function callSolanaRpc<T = unknown>(
  rpcUrl: string,
  method: string,
  params: unknown[] = [],
  timeoutMs = 10000,
): Promise<SolanaRpcResponse<T>> {
  const url = new URL(rpcUrl);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Solana RPC URL must use http or https');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const id = randomUUID();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
      signal: controller.signal,
    });
    const data = await response.json() as SolanaRpcResponse<T>;
    if (!response.ok && !data.error) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: response.status, message: `HTTP ${response.status}` },
      };
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function createSolanaTarget(params: {
  name: string;
  type: Target['type'];
  address: string;
  zone?: TargetZone;
  protocol?: string;
  metadata?: Record<string, unknown>;
}): Target {
  return {
    id: randomUUID(),
    name: params.name,
    type: params.type,
    zone: params.zone || 'external',
    status: 'discovered',
    address: params.address,
    protocol: params.protocol,
    services: [],
    vulnerabilities: [],
    credentials: [],
    metadata: {
      ecosystem: 'solana',
      ...(params.metadata || {}),
    },
    discoveredAt: Date.now(),
  };
}

export function createSolanaProgramTarget(
  programId: string,
  cluster: SolanaCluster = 'devnet',
  metadata: Record<string, unknown> = {},
): Target {
  const address = assertSolanaAddress(programId, 'program id');
  return createSolanaTarget({
    name: `Solana Program ${shortenSolanaAddress(address)}`,
    type: 'solana_program',
    address,
    protocol: 'solana',
    metadata: { cluster, explorer: solanaExplorerUrl(address, cluster), ...metadata },
  });
}

export function createSolanaAccountTarget(
  accountAddress: string,
  cluster: SolanaCluster = 'devnet',
  metadata: Record<string, unknown> = {},
): Target {
  const address = assertSolanaAddress(accountAddress, 'account address');
  return createSolanaTarget({
    name: `Solana Account ${shortenSolanaAddress(address)}`,
    type: 'solana_account',
    address,
    protocol: 'solana',
    metadata: { cluster, explorer: solanaExplorerUrl(address, cluster), ...metadata },
  });
}

export function createSolanaTokenTarget(
  mintAddress: string,
  cluster: SolanaCluster = 'devnet',
  metadata: Record<string, unknown> = {},
): Target {
  const address = assertSolanaAddress(mintAddress, 'token mint');
  return createSolanaTarget({
    name: `SPL Token ${shortenSolanaAddress(address)}`,
    type: 'solana_token',
    address,
    protocol: 'spl-token',
    metadata: { cluster, explorer: solanaExplorerUrl(address, cluster), ...metadata },
  });
}

export function createSolanaRpcTarget(
  rpcUrl: string,
  cluster: SolanaCluster = 'devnet',
  metadata: Record<string, unknown> = {},
): Target {
  const url = new URL(rpcUrl);
  return createSolanaTarget({
    name: `Solana RPC ${url.hostname}`,
    type: 'solana_rpc',
    address: rpcUrl,
    protocol: 'json-rpc',
    metadata: { cluster, ...metadata },
  });
}
