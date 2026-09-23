import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://twilightcoders.net',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
