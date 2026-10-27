import { spawnSync } from 'node:child_process';
// Starts the demo artifact. Access still requires signed request-time project identity.
const result = spawnSync(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: { ...process.env, EMILIST_BUILD_TARGET: 'demo' },
  },
);
process.exit(result.status ?? 1);
