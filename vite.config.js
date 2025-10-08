import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'node:path';

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
  },
  plugins: [
    handlebars({
      // Make partials available like {{> header}} / {{> footer}}
      partialDirectory: path.resolve(__dirname, 'public/partials'),
      // Optional global data available as {{title}}, etc.
      context: {
        siteName: 'Trivia Game',
      },
    }),
  ],
});
