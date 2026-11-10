// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  base: process.env.PREVIEW_BASE || '/',
  build: {
    assets: process.env.PREVIEW_BASE ? 'assets' : '_astro',
  },
});
