// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.DEMO_SITE ?? 'https://oberonlai.github.io',
  base: process.env.DEMO_BASE ?? '/tsubaki-demo',
  integrations: [mdx(), sitemap()],
});
