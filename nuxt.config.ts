
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxtjs/google-fonts", 'nuxt-primevue', "@nuxtjs/tailwindcss", "@hebilicious/vue-query-nuxt", '@pinia/nuxt',  '@nuxtjs/device',],

  pinia: {
    storesDirs: ['./stores/**'],
  },

  device: {
    refreshOnResize: true
  },
  
  primevue: {
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
    options: {
      locale: {
        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        weekDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        firstDayOfWeek: 1,
        dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        dayNamesShort: ["Вос", "Пон", "Вто", "Сре", "Чет", "Пят", "Суб"],
        emptyFilterMessage: 'Не найдено',
    }
    }
    
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