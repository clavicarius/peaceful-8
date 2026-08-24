import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  base: '/peaceful-8/',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@peaceful-8/engine': fileURLToPath(
        new URL('../../packages/engine/src/index.ts', import.meta.url)
      ),
    },
  },
});
