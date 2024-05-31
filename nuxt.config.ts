
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxtjs/google-fonts", 'nuxt-primevue', "@nuxtjs/tailwindcss", "@hebilicious/vue-query-nuxt", '@pinia/nuxt'],

  pinia: {
    storesDirs: ['./stores/**'],
  },
  
  primevue: {
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities'
},

    css: ['primevue/resources/themes/aura-light-purple/theme.css', 'primeicons/primeicons.css', 'assets/css/main.css'],

    tailwindcss: {
      cssPath: ['~/assets/css/tailwind.css', { injectPosition: "first" }],
      configPath: 'tailwind.config',
      exposeConfig: {
        level: 2
      },
      config: {},
      viewer: true,
    },
    
  googleFonts: {
    families: {
      Roboto: true,

    }
  },
  

   


})