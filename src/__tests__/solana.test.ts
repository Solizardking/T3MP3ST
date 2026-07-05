import { describe, expect, it } from 'vitest';
import {
  Arsenal,
  BUILTIN_TOOLS,
  createSolanaMissionReceipt,
  createSolanaProgramTarget,
  createToolContext,
  isSolanaAddress,
  normalizeSolanaCluster,
  solanaExplorerUrl,
} from '../index.js';
import { createReconTasks } from '../mission/index.js';
import { adaptersForFamily } from '../arsenal/catalog.js';
import { promptPacksForFamily, resourcesForFamily, runbookForFamily, workflowPresetsForFamily } from '../resources/index.js';

const SYSTEM_PROGRAM = '11111111111111111111111111111111';

describe('Solana native support', () => {
  it('validates Solana public keys and normalizes clusters', () => {
    expect(isSolanaAddress(SYSTEM_PROGRAM)).toBe(true);
    expect(isSolanaAddress('not-a-solana-address')).toBe(false);
    expect(normalizeSolanaCluster('mainnet')).toBe('mainnet-beta');
    expect(normalizeSolanaCluster('localhost')).toBe('localnet');
    expect(solanaExplorerUrl(SYSTEM_PROGRAM, 'devnet')).toContain('cluster=devnet');
  });

  it('creates Solana program targets with on-chain metadata', () => {
    const target = createSolanaProgramTarget(SYSTEM_PROGRAM, 'devnet', { owner: 'native-loader' });
    expect(target.type).toBe('solana_program');
    expect(target.protocol).toBe('solana');
    expect(target.metadata?.ecosystem).toBe('solana');
    expect(target.metadata?.cluster).toBe('devnet');
  });

  it('seeds Solana-specific tasks for Solana public keys', () => {
    const tasks = createReconTasks('mission-solana', SYSTEM_PROGRAM);
    expect(tasks.map(task => task.name)).toContain('Solana Address Classification');
    expect(tasks.some(task => task.name === 'DNS Enumeration')).toBe(false);
    expect(tasks.every(task => task.description.includes('Solana') || task.description.includes(SYSTEM_PROGRAM))).toBe(true);
  });

  it('exposes Solana resource packs, workflow presets, runbook, and catalog adapters', () => {
    expect(workflowPresetsForFamily('solana_onchain').map(item => item.id)).toContain('starter-solana-onchain');
    expect(resourcesForFamily('solana_onchain').map(item => item.id)).toEqual(
      expect.arrayContaining(['solana-program-security', 'spl-token-docs', 'token-2022-docs', 'anchor-docs']),
    );
    expect(promptPacksForFamily('solana_onchain').map(item => item.id)).toContain('prompt-solana-onchain-sentinel');
    expect(runbookForFamily('solana_onchain')?.title).toContain('Solana');
    expect(adaptersForFamily('solana_onchain').map(adapter => adapter.id)).toEqual(
      expect.arrayContaining(['solana-cli', 'spl-token-cli', 'anchor-cli', 'codama', 'litesvm', 'surfpool']),
    );
  });

  it('runs Solana built-in planning tools without signing or network calls', async () => {
    const arsenal = new Arsenal();
    arsenal.registerMany(BUILTIN_TOOLS);

    const validate = await arsenal.execute('solana_address_validate', createToolContext(undefined, {
      address: SYSTEM_PROGRAM,
      cluster: 'devnet',
    }));
    expect(validate.success).toBe(true);
    expect(validate.output).toContain('valid=true');

    const dryRun = await arsenal.execute('solana_transaction_dry_run_plan', {
      mission: 'mission-solana',
      parameters: {
        intent: 'simulate a no-op instruction against a local fixture',
        target: SYSTEM_PROGRAM,
        accounts: [SYSTEM_PROGRAM],
        valueMovement: false,
      },
    });
    expect(dryRun.success).toBe(true);
    expect(dryRun.output).toContain('Required gates before signing');
    expect(dryRun.output).not.toMatch(/submit|signature=/i);
  });

  it('creates deterministic Solana receipt hashes for approval gates', () => {
    const one = createSolanaMissionReceipt({
      missionId: 'mission-solana',
      action: 'dry-run',
      target: SYSTEM_PROGRAM,
      reason: 'simulation only',
    });
    const two = createSolanaMissionReceipt({
      missionId: 'mission-solana',
      action: 'dry-run',
      target: SYSTEM_PROGRAM,
      reason: 'simulation only',
    });
    expect(one).toBe(two);
    expect(one).toHaveLength(64);
  });
});
