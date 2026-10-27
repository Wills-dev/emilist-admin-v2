import { spawnSync } from 'node:child_process';
const target = process.argv[2];
if (!['demo', 'production'].includes(target))
  throw new Error('An explicit build target is required.');
const result = spawnSync(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'build', ...process.argv.slice(3)],
  {
    stdio: 'inherit',
    env: { ...process.env, EMILIST_BUILD_TARGET: target },
  },
);
process.exit(result.status ?? 1);
