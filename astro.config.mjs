// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages :
// - dépôt "<pseudo>.github.io"  -> SITE_URL=https://<pseudo>.github.io  BASE_PATH=/
// - autre dépôt "portfolio"     -> SITE_URL=https://<pseudo>.github.io  BASE_PATH=/portfolio
// Ces deux variables sont remplies automatiquement par le workflow .github/workflows/deploy.yml
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.github.io',
  base: process.env.BASE_PATH || '/',
  build: { inlineStylesheets: 'always' },
});
