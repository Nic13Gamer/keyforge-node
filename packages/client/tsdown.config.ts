import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/offline/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: './dist',
  clean: true,
});
