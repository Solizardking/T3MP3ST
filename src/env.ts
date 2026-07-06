import { existsSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(moduleDir, '..');

function applyEnvFile(filePath: string): boolean {
  if (!existsSync(filePath)) return false;

  const parsed = dotenv.parse(readFileSync(filePath));
  for (const [key, value] of Object.entries(parsed)) {
    if (value !== '' && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return true;
}

export function loadProjectEnv(root: string = appRoot): string[] {
  const explicit = process.env.T3MP3ST_ENV_FILE?.trim();
  const envFiles = [
    ...(explicit ? [resolve(explicit)] : []),
    join(root, '.env.local'),
    join(root, '.env'),
  ];

  return envFiles.filter(applyEnvFile);
}

export const loadedProjectEnvFiles = loadProjectEnv();
