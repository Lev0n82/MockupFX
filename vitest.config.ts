import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@mockupfx/format': new URL('./packages/format/src/index.ts', import.meta.url).pathname,
      '@mockupfx/runtime': new URL('./packages/runtime/src/index.ts', import.meta.url).pathname,
      '@mockupfx/test-fixtures': new URL('./packages/test-fixtures/src/index.ts', import.meta.url).pathname
    }
  },
  test: {
    environment: 'node',
    include: ['packages/*/tests/**/*.test.ts'],
    reporters: ['default']
  }
});
