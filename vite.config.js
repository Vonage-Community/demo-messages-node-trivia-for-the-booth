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
        register: './public/register.html',
        main: './public/index.html',
        admin: './public/admin.html',
        login: './public/login.html',
        play: './public/play.html',
        tos: './public/tos.html',
        leaderboard: './public/leaderboard.html',
      },
    },
  },

  plugins: [
    handlebars({
      partialDirectory: [
        path.resolve(__dirname, 'public/partials'),
        path.resolve(__dirname, 'public'),
      ],
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
