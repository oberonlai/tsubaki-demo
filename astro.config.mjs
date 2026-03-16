import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://oberonlai.github.io',
  base: '/tsubaki-demo',
  integrations: [mdx()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    resolve: {
      alias: {
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      },
    },
  },
});
