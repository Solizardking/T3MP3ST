import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(__dirname, '..');

function applyEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return false;

  const parsed = dotenv.parse(fs.readFileSync(filePath));
  for (const [key, value] of Object.entries(parsed)) {
    if (value !== '' && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return true;
}

export function loadRepoEnv({ root = defaultRoot, includeKeysLocal = true } = {}) {
  const explicit = process.env.T3MP3ST_ENV_FILE?.trim();
  const envFiles = [
    ...(explicit ? [path.resolve(explicit)] : []),
    path.join(root, '.env.local'),
    path.join(root, '.env'),
    ...(includeKeysLocal ? [path.join(root, '.keys.local')] : []),
  ];

  return envFiles.filter(applyEnvFile);
}
