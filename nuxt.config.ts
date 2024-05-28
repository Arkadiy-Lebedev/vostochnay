// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/google-fonts", 'nuxt-primevue', "@nuxtjs/tailwindcss", "@hebilicious/vue-query-nuxt"],

  primevue: {
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities'
},

    css: ['primevue/resources/themes/aura-light-green/theme.css', 'primeicons/primeicons.css', 'assets/css/main.css'],

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
  }

   


})