const dev = process.env.DEPLOY_ENV !== 'prod'

require('dotenv').config({
  path: dev ? '.env' : 'prod.env'
})

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: process.env.APP_TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.APP_DESCRIPTION }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    // Main scss code to compile
    '~assets/scss/main.scss'
  ],
  styleResources: {
    scss: [
      // Expose sass variables in Vue components
      '~assets/scss/variables.scss'
    ]
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/helpers.js' }
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
    ['nuxt-buefy',
      {
        css: false, // Set css to false to not include default buefy CSS (we will compile our own)
        materialDesignIcons: false,
        defaultIconPack: 'fas',
        defaultIconComponent: 'font-awesome-icon'
      }
    ],

    // Expose variables to components automatically. See styleResources configuration above
    '@nuxtjs/style-resources',

    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

    'nuxt-vuex-router-sync',

    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: process.env.FIREBASE_CONFIG_API_KEY || '',
          authDomain: process.env.FIREBASE_CONFIG_AUTH_DOMAIN || '',
          databaseURL: process.env.FIREBASE_CONFIG_DATABASE_URL || '',
          projectId: process.env.FIREBASE_CONFIG_PROJECT_ID || '',
          storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET || '',
          messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID || '',
          appId: process.env.FIREBASE_APP_ID || '',
          measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
        },
        services: {
          auth: {
            initialize: {
              onAuthStateChangedAction: 'auth/loadUser'
            }
          },
          firestore: true,
          functions: true,
          storage: true
        },
        onFirebaseHosting: true
      }
    ],
    ['nuxt-fontawesome',
      {
        imports: [
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['faGoogle', 'faFacebookF']
          },
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['faBars', 'faUser', 'faCog', 'faSignOutAlt']
          }
        ]
      }
    ]
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // Static URLs should be generated with '/assets/' at the beginning of the path instead of '/_nuxt/',
    // so that they will be loaded from the CDN via Firebase Hosting, and not processed through the SSR cloud function
    publicPath: '/assets/',

    // Extract CSS to dedicated CSS files in production
    extractCSS: !dev
  },

  // Nuxt directories are in /src instead of in the root directory
  srcDir: 'src',

  // Compiled app needs to be in /functions so that Cloud Functions has access to it (to do the server-side rendering)
  buildDir: 'functions/.nuxt',

  env: {
    APP_TITLE: process.env.APP_TITLE,
    APP_DESCRIPTION: process.env.APP_DESCRIPTION,
    APP_DOMAIN: process.env.APP_DOMAIN
  }
}
