import { defineConfig } from 'vitest/config';
import path from 'node:path';

const currentDir = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(currentDir, './'),
      'server-only': path.resolve(currentDir, './test/mocks/empty.ts'),
      'next/cache': path.resolve(currentDir, './test/mocks/next-cache.ts'),
    },
  },
  test: {
    environment: 'node',
  },
});
