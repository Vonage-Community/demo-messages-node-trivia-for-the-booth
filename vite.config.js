import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'node:path';
import { getHostUrl } from './server/getHost.js';

const apiHostUrl = getHostUrl(3000)

export default defineConfig({
  root: 'public',
  publicDir: false,

  server: {
    host: true,
    port: 5173,
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        main: '/src/js/main.js',
        admin: '/src/js/admin.js',
        player: '/src/js/player.js',
      },
    },
  },

  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, 'public/partials'),
      context: {
        siteName: 'Trivia Game',
        apiHostUrl,
      },
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'import',
          'mixed-decls',
          'color-functions',
          'global-builtin',
        ],
      },
    },
  },
});
