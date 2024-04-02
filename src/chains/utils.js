import { dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function ensureDirectoryExistence(filePath) {
    const d = dirname(filePath);

    if (existsSync(d)) {
      return;
    }
    ensureDirectoryExistence(d);
    mkdirSync(d, { recursive: true });
}