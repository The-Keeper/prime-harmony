import { defineConfig, 
    // presetWind4, 
    // presetWebFonts 
} from 'unocss'

export default defineConfig({
    // presets: [presetWind4({
    //     dark: "class",
    //     preflights: {
    //         reset: true
    //     },
    // }),
    // presetWebFonts({
    //     provider: 'bunny',
    //     fonts: {
    //         serif: ['Alegreya'],
    //         sans: ['Alegreya Sans'],
    //         mono: ['Roboto Slab'],
    //     },
    // })
    // ],
    theme: {
        colors: {
            'text': 'hsl(var(--text))',
            'background': 'hsl(var(--background))',
            'primary': 'hsl(var(--primary))',
            'secondary': 'hsl(var(--secondary))',
            'accent': 'hsl(var(--accent))',
        }
    },
})
