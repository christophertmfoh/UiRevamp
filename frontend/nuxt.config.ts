// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    googleApiKey: process.env.GOOGLE_API_KEY_1,
    googleApiFallback: process.env.GOOGLE_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8080',
      appName: 'Fablecraft',
      appTagline: 'Craft Your Fable'
    }
  },

  nitro: {
    experimental: {
      wasm: true
    }
  },

  typescript: {
    typeCheck: true
  },

  ssr: true,

  app: {
    head: {
      title: 'Fablecraft - Craft Your Fable',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Advanced AI-powered creative writing platform that empowers writers to craft immersive narratives with intelligent character generation and world-building tools.' 
        },
        { name: 'format-detection', content: 'telephone=no' },
        // Open Graph
        { property: 'og:title', content: 'Fablecraft - Craft Your Fable' },
        { property: 'og:description', content: 'Advanced AI-powered creative writing platform with intelligent character generation and world-building tools.' },
        { property: 'og:type', content: 'website' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Fablecraft - Craft Your Fable' },
        { name: 'twitter:description', content: 'Advanced AI-powered creative writing platform with intelligent character generation and world-building tools.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_colors.scss" as *;'
        }
      }
    }
  }
})