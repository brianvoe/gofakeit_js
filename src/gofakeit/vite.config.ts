import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
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
      outDir: '../../dist',
      include: ['*.ts'],
      exclude: ['test/**', '**/*.test.ts', 'vite.config.ts'],
    }),
  ],
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
})
