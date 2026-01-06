import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.js', 'e2e/**/*.e2e.test.js'],
    testTimeout: 30000,
  },
});
