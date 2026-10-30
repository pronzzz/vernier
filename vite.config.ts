import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  build: { target: 'es2022', cssMinify: true },
  test: { environment: 'node' },
} as never)
