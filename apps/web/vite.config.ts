import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/peaceful-8/',
  plugins: [react()],
  resolve: {
    alias: {
      '@peaceful-8/engine': resolve(import.meta.dirname, '../../packages/engine/src/index.ts'),
    },
  },
});
