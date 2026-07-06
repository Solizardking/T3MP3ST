import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const configSource = readFileSync(join(process.cwd(), 'src/config/index.ts'), 'utf8');
const projectEnvSource = readFileSync(join(process.cwd(), 'src/env.ts'), 'utf8');
const scriptEnvSource = readFileSync(join(process.cwd(), 'scripts/env.mjs'), 'utf8');
const setupScript = readFileSync(join(process.cwd(), 'scripts/setup-api.sh'), 'utf8');

function configLoadEnvBlock(): string {
  const start = configSource.indexOf('private loadEnvVariables(): void');
  expect(start).toBeGreaterThanOrEqual(0);
  const end = configSource.indexOf('\n  /**\n   * Get all settings', start);
  expect(end).toBeGreaterThan(start);
  return configSource.slice(start, end);
}

describe('API key environment handling hardening', () => {
  it('ConfigManager does not implicitly read .env from the caller working directory', () => {
    const block = configLoadEnvBlock();

    expect(block).not.toContain("join(process.cwd(), '.env')");
    expect(block).toContain("join(homedir(), '.t3mp3st', '.env')");
  });

  it('project env bootstrap reads app-root env files without using caller cwd', () => {
    expect(projectEnvSource).toContain("join(root, '.env.local')");
    expect(projectEnvSource).toContain("join(root, '.env')");
    expect(projectEnvSource).not.toContain('process.cwd()');

    expect(scriptEnvSource).toContain("path.join(root, '.env.local')");
    expect(scriptEnvSource).toContain("path.join(root, '.env')");
    expect(scriptEnvSource).not.toContain('process.cwd()');
  });

  it('ConfigManager uses env keys in-memory and does not persist imported env keys', () => {
    const block = configLoadEnvBlock();

    expect(block).not.toMatch(/setApiKey\(/);
    expect(block).not.toMatch(/config\.set\(['"]apiKeys['"]/);
  });

  it('setup-api.sh never sources .env and reads API keys silently into a 0600 file', () => {
    expect(setupScript).not.toMatch(/\bsource\s+["']?\$ENV_FILE/);
    expect(setupScript).toMatch(/umask\s+077/);
    expect(setupScript).toMatch(/read\s+-rsp\s+"Enter your OpenRouter API key:/);
    expect(setupScript).toMatch(/chmod\s+600\s+"\$ENV_FILE"/);
  });
});
