export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Visuari',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // Static URLs should be generated with '/assets/' at the beginning of the path instead of '/_nuxt/',
    // so that they will be loaded from the CDN via Firebase Hosting, and not processed through the SSR cloud function
    publicPath: '/assets/'
  },

  // Nuxt directories are in /src instead of in the root directory
  srcDir: 'src',

  // Compiled app needs to be in /functions so that Cloud Functions has access to it (to do the server-side rendering)
  buildDir: 'functions/.nuxt'
}
