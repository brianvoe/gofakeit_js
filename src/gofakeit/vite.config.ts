import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'Gofakeit',
      fileName: format => `gofakeit.${format}.js`,
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        exports: 'named',
      },
    },
    sourcemap: true,
    minify: true,
    outDir: '../../dist',
    emptyOutDir: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      outDir: '../../dist',
    }),
  ],
  // @ts-ignore - test config is valid for Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/gofakeit/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/gofakeit/**/*.ts'],
      exclude: ['node_modules/', 'src/gofakeit/test/', 'dist/', '**/*.d.ts'],
    },
  },
});
