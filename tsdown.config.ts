import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts'],
  dts: true,
  format: 'esm',
  outDir: 'dist',
  sourcemap: false,
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  deps: {
    neverBundle: ['@vitest/expect', '@vitest/runner', '@vitest/utils'],
  },
});
