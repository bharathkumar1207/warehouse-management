/* v8 ignore start */
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/.trunk/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      clean: true,
      cleanOnRerun: true,
      exclude: [
        '**/mocks/**',
        '**/__mocks__/**',
        '**/migrations/**',
        '**/test/**',
        '**/tests/**',
      ],
      reporter: ['text', 'json-summary', 'json'], // cSpell: disable-line
    },
    clearMocks: true,
    env: loadEnv('', process.cwd(), ''),
  },
});