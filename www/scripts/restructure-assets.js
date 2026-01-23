import { cpSync, mkdirSync, rmSync, readdirSync } from 'fs';
import { join } from 'path';

const clientDir = join(import.meta.dirname, '../dist/client');
const tiempoDir = join(clientDir, 'tiempo');

// Create tiempo subdirectory
mkdirSync(tiempoDir, { recursive: true });

// Move all files from client to client/tiempo
const items = readdirSync(clientDir);
for (const item of items) {
  if (item === 'tiempo') continue;
  const src = join(clientDir, item);
  const dest = join(tiempoDir, item);
  cpSync(src, dest, { recursive: true });
  rmSync(src, { recursive: true, force: true });
}

console.log('✓ Restructured assets into /tiempo/ subdirectory');
