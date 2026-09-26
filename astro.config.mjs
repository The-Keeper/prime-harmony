// @ts-check
import { defineConfig } from "astro/config";
// import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
    site: "https://the-keeper.github.io",
    base: "prime-harmony",
    i18n: {
        locales: ["ru", "en"],
        defaultLocale: "en",
        routing: {
            // All locales (including the default) live under /[locale]/,
            // matching the src/pages/[locale]/ structure.
            prefixDefaultLocale: true,
            // Keep our own browser-language redirect at "/".
            redirectToDefaultLocale: false,
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    // @picocss/pico@2.1.1 still uses the deprecated Sass if() function.
                    silenceDeprecations: ["if-function"],
                },
            },
        },
    },
    // integrations: [UnoCSS(), svelte()],
});