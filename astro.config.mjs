// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://the-keeper.github.io',
  base: 'prime-harmony',
  i18n: {
    locales: ["ru", "en"],
    defaultLocale: "en",
    routing: {
      redirectToDefaultLocale: true,
      fallbackType: "rewrite",
    }
  },
});
