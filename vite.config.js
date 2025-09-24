import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  publicDir: false,
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, 'rpc')
      }
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext'
  }
});
