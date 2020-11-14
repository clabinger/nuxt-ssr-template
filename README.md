# ssr-nuxt-firebase-buefy Project Template

### Initialize Nuxt

1. Run `yarn create nuxt-app my-project` with the following options:
    * Project name: (leave default)
    * Programming language: __JavaScript__
    * Package manager: __Yarn__
    * UI framework: __Buefy__
    * Nuxt.js modules: __Progressive Web App (PWA)__
    * Linting tools: __ESLint__
    * Testing framework: __None__
    * Rendering mode: __Universal (SSR / SSG)__
    * Deployment target: __Server (Node.js hosting)__
    * Development tools: __jsconfig.json (Recommended for VS Code if you're not using typescript)__
    * Continuous integration: __None__
    * Version control system: __Git__

### Remove nuxt filler content and README files

1. Delete files
  
    ```sh
    rm assets/README.md
    rm components/README.md
    rm layouts/README.md
    rm middleware/README.md
    rm pages/README.md
    rm plugins/README.md
    rm static/README.md
    rm store/README.md
    rm components/Card.vue
    rm components/Logo.vue
    rm pages/inspire.vue
    rm assets/buefy.png
    ```

2. Replace nuxt filler content with base content:

    ```html
    <!-- layouts/default.vue -->
    <template>
      <div>
        <div class="container">
          <nuxt />
        </div>
      </div>
    </template>
    ```

    ```html
    <!-- pages/index.vue -->
    <template>
      <section class="section">
        <h1>
          Home
        </h1>
      </section>
    </template>
    ```

3. Create similar placeholder pages:

    ```sh
    pages/about.vue
    pages/private.vue
    ```

### Initialize Firebase

1. Create projects in Firebase console (create a __prod__ project and a __test__ project)
2. For each project, upgrade to Blaze Plan and assign to billing account (create new billing account if needed)
3. In the Firebase console, set up Firestore - choose production mode (deny all requests by default) and region
4. Run `firebase init` in root project directory
    * Choose features: Firestore, Functions, Hosting, Storage, Emulators
    * Choose project (or create new)
    * Use default `firestore.rules`
    * Use default `firestore.indexes.json`
    * Choose language: __Javascript__
    * Use ESLint: __Yes__
    * Do not install dependencies now
    * Public directory: `public`
    * Single Page App: __No__
    * Automatic builds and deploys: __No__
    * Use default `storage.rules`
    * Select emulators: Authentication, Functions, Firestore, Hosting
    * Use default ports for emulators
    * Enable the Emulator UI: __Yes__
    * Emulator UI Port: `4000`
    * Download emulators now: __No__

5. Add the following to `.gitignore`:

    ```sh
    # Firebase
    /.firebase
    .firebaserc
    ```

7. Update `.firebaserc`
    * Run `cp .firebaserc example.firebaserc`
    * Update `example.firebaserc` with sample project IDs for `default` (test) and `prod`
    * Update `.firebaserc` with actual project IDs for `default` (test) and `prod`

### Set up SSR

1. Move Nuxt directories into `/src` (`assets`, `components`, `layouts`, `middleware`, `pages`, `plugins`, `static`, `store`)

2. Add the following to `.gitignore`:

    ```sh
    # SSR
    /public
    ```

3. Add the following to `functions/.gitignore`:
    
    ```sh
    # functions/package.json is generated at build time
    /package.json
    ```

4. Use `yarn` instead of `npm` in `firebase.json`:
        
    ```json
    "functions": {
      "predeploy": [
        "yarn --prefix \"$RESOURCE_DIR\" lint"
      ]
    }
    ```

5. In `firebase.json`, add:

    ```json
    "hosting": {
      "rewrites": [
        {
          "source": "**",
          "function": "nuxtssr"
        }
      ]
    }
    ```

6. Set the following in `nuxt.config.js`:

    ```javascript
    build: {
      // Static URLs should be generated with '/assets/' at the beginning of the path instead of '/_nuxt/',
      // so that they will be loaded from the CDN via Firebase Hosting, and not processed through the SSR cloud function
      publicPath: '/assets/'
    },

    // Nuxt directories are in /src instead of in the root directory
    srcDir: 'src',

    // Compiled app needs to be in /functions so that Cloud Functions has access to it (to do the server-side rendering)
    buildDir: 'functions/.nuxt'
    ```

7. Add the following scripts to `package.json`:

    ```json
    "postinstall": "node ./functions_install.js",
    "precommit": "yarn lint",
    "prebuild": "yarn clean && yarn lint",
    "postbuild": "yarn copyassets && yarn copystatic",
    "clean": "yarn clean:public && yarn clean:functions",
    "clean:public": "mkdir -p ./public && rimraf ./public/*",
    "clean:functions": "mkdir -p ./functions/.nuxt && rimraf ./functions/.nuxt/*",
    "copyassets": "mkdir -p ./public/assets && cp -R ./functions/.nuxt/dist/client/* ./public/assets",
    "copystatic": "cp -R ./src/static/* ./public",
    "serve": "DEBUG=nuxt:* firebase serve --only hosting,functions -p 3000",
    "build:serve": "yarn build && yarn serve",
    "deploy": "firebase deploy -P default",
    "buildDeploy": "yarn build && yarn deploy",
    "buildDeploy:prod": "DEPLOY_ENV=prod yarn build && firebase deploy -P prod"
    ```

8. Add the following sections to `package.json`. Install these packages with `yarn` normally first, then move the lines to this section (the versions listed here are not real).

    ```json
    "firebaseFunctionsDependencies": {
      "firebase-admin": "~0.0.0",
      "firebase-functions": "^0.0.0"
    },
    "firebaseFunctionsExcludeDependencies": [
    ]
    ```

9. Set the node version in `package.json`:

    ```json
    "engines": {
      "node": "12"
    }
    ```

10. Set the node version in `firebase.json`:

    ```json
    "functions": {
      "runtime": "nodejs12"
    },
    ```

11. Add the following files in the root directory:

    ```
    functions_install.js
    generate_functions_package_json.js
    ```

12. Add the `nuxtssr` function: `functions/nuxtssr.js`

13. Export the `nuxtssr` function in `functions/index.js` (remove all of the default content):

    ```javascript
    exports.nuxtssr = require('./nuxtssr').default
    ```

### Set up environment configuration

1. Create the following files:

    ```sh
    # Development/Test environment
    .env

    # Production environment
    prod.env

    # Insert same variables here with example values
    example.env
    ```

2. Add app configuration values to `.env` files:

    ```sh
    APP_TITLE=My Project
    APP_DESCRIPTION=My Project Description
    APP_DOMAIN=my-project.example.com
    ```

3. Add the following to `.gitignore`:

    ```sh
    # Environment configuration
    prod.env
    ```

4. Install __dotenv__:

    ```sh
    yarn add -D dotenv
    ```

5. Insert the following at the top of `nuxt.config.js`:

    ```javascript
    const dev = process.env.DEPLOY_ENV !== 'prod'

    require('dotenv').config({
      path: dev ? '.env' : 'prod.env'
    })
    ```

6. Update the `head` configuration in `nuxt.config.js` to reference the `APP_TITLE` and `APP_DESCRIPTION` environment variables:

    ```javascript
    head: {
      title: process.env.APP_TITLE,
      meta: [
        { hid: 'description', name: 'description', content: process.env.APP_DESCRIPTION }
      ]
    }
    ```

7. Update `nuxt.config.js` to inject necessary environment variables into the client app. 
    
    Do not inject secret environment variables that are not intended for use in a client app.

    ```javascript
    env: {
      APP_TITLE: process.env.APP_TITLE,
      APP_DESCRIPTION: process.env.APP_DESCRIPTION,
      APP_DOMAIN: process.env.APP_DOMAIN
    }
    ```

### Set up styles

1. Install __node-sass__ and __sass-loader__. At the time of this writing, Bulma is only compatible with `node-sass@^4.0.0`.

    ```sh
    yarn add -D node-sass@^4.0.0 sass-loader
    ```

2. Install __@nuxtjs/style-resources__ so that sass variables will be exposed to Vue components:

    ```sh
    yarn add -D @nuxtjs/style-resources
    ```

3. Add the following files to `src/assets/scss/`:

    ```sh
    # Override bulma/buefy variables that do not depend on bulma variables
    # Import Bulma utilities (includes variables)
    # Override bulma/buefy variables that depend on bulma variables
    # Import mixins.scss
    variables.scss

    # Define mixins needed in components
    mixins.scss

    # Import variables.scss
    # Import bulma and buefy source files needed for this app
    buefy-custom.scss

    # Import buefy-custom.scss
    # Define additional global styles
    main.scss
    ```

4. Set the following in `nuxt.config.js` to load sass resources:

    ```javascript
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
    modules: [
      // Set css to false to not include default buefy CSS (we will compile our own)
      ['nuxt-buefy', { css: false }],
      // Expose variables to components automatically. See styleResources configuration above
      '@nuxtjs/style-resources'
    ],
    build: {
      // Extract CSS to dedicated CSS files in production
      extractCSS: !dev
    }
    ```

### Integrate Firebase

1. Install packages:

    ```sh
    yarn add firebase @nuxtjs/firebase
    ```

2. Add example Firebase configuration values to `example.env`:

    ```sh
    # Firebase configuration
    # Get it from https://console.firebase.google.com
    # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    FIREBASE_CONFIG_API_KEY=SoMeLeTtErS-MOreLetTErSAnDNumb3r5
    FIREBASE_CONFIG_AUTH_DOMAIN=auth-domain.example.com
    FIREBASE_CONFIG_DATABASE_URL=https://my-project.firebaseio.com
    FIREBASE_CONFIG_PROJECT_ID=my-project
    FIREBASE_CONFIG_STORAGE_BUCKET=my-project.appspot.com
    FIREBASE_CONFIG_MESSAGING_SENDER_ID=012345678901
    FIREBASE_APP_ID=1:123456789012:web:abc123abc123abc123abc1
    ```


3. Add real Firebase configuration values in `.env` and `prod.env`

4. Add `@nuxtjs/firebase` configuration to `nuxt.config.js`:

    ```javascript
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
    ]
    ```

### Set up auth store

1. Add `nuxt-vuex-router-sync` for handling `#sign-in` URL hash:

    ```sh
    yarn add nuxt-vuex-router-sync
    ```

    ```javascript
    // nuxt.config.js
    modules: [
      'nuxt-vuex-router-sync',
    ]
    ```

2. Add `Object.pick` function in `src/plugins/helpers.js`. Register the plugin:

    ```javascript
    // nuxt.config.js
    plugins: [
      { src: '~/plugins/helpers.js' }
    ]
    ```

3. Add auth store in `src/store/auth.js`

### Set up root store and pages store

1. Add stores:

    ```sh
    src/store/index.js
    src/store/pages.js
    ```

### Add middleware

1. Add file `src/middleware/general.js`.

2. Register middleware in `src/layouts/default.vue`:

    ```html
    <script>
    export default {
      middleware: [
        'general'
      ]
    }
    </script>
    ```

### Add page metadata to `<head>` tag

1. Add `head()` function and associated vuex state (using `mapState` and `mapGetters`) to `src/layouts/default.vue`.

### Add logo artwork

1. Add files:

    ```sh
    src/static/logo.svg
    src/static/logo-animated.svg
    src/static/logo-title.png
    src/static/social-image.png
    ```

### Test configuration

```sh
# Install dependencies
yarn install

# Test locally
yarn build:serve

# Deploy to test project
yarn buildDeploy
```
