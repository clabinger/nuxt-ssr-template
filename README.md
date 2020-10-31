# visuari

## Devops setup

### Initialize Nuxt

1. Run `yarn create nuxt-app visuari` with the following options:
    * Project name: __visuari__
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

        # Firebase
        /.firebase
        .firebaserc

7. Update `.firebaserc`
    * Run `cp .firebaserc example.firebaserc`
    * Update `example.firebaserc` with sample project IDs for `default` (test) and `prod`
    * Update `.firebaserc` with actual project IDs for `default` (test) and `prod`

### Set up SSR

1. Move Nuxt directories into `/src` (`assets`, `components`, `layouts`, `middleware`, `pages`, `plugins`, `static`, `store`)

2. Add the following to `.gitignore`:

        # SSR
        /public

3. Add the following to `functions/.gitignore`:
      
        # functions/package.json is generated at build time
        /package.json

4. Use `yarn` instead of `npm` in `firebase.json`:
        
        "functions": {
          "predeploy": [
            "yarn --prefix \"$RESOURCE_DIR\" lint"
          ]
        }

5. In `firebase.json`, add:

        "hosting": {
          "rewrites": [
            {
              "source": "**",
              "function": "nuxtssr"
            }
          ]
        }

6. Set the following in `nuxt.config.js`:

        build: {
          // Static URLs should be generated with '/assets/' at the beginning of the path instead of '/_nuxt/',
          // so that they will be loaded from the CDN via Firebase Hosting, and not processed through the SSR cloud function
          publicPath: '/assets/'
        },

        // Nuxt directories are in /src instead of in the root directory
        srcDir: 'src',

        // Compiled app needs to be in /functions so that Cloud Functions has access to it (to do the server-side rendering)
        buildDir: 'functions/.nuxt'

7. Add the following scripts to `package.json`:

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

8. Add the following sections to `package.json`. Install these packages with `yarn` normally first, then move the lines to this section (the versions listed here are not real).

        "firebaseFunctionsDependencies": {
          "firebase-admin": "~0.0.0",
          "firebase-functions": "^0.0.0"
        },
        "firebaseFunctionsExcludeDependencies": [
        ]

9. Set the node version in `package.json`:

        "engines": {
          "node": "12"
        }

10. Set the node version in `firebase.json`:

        "functions": {
          "runtime": "nodejs12"
        },

11. Add the following files in the root directory:

        functions_install.js
        generate_functions_package_json.js

12. Add the `nuxtssr` function: `functions/nuxtssr.js`

13. Export the `nuxtssr` function in `functions/index.js` (remove all of the default content):

        exports.nuxtssr = require('./nuxtssr').default

### Set up environment configuration

1. Create the following files:

				# Development/Test environment
				.env

				# Production environment
				prod.env

				# Insert same variables here with example values
				example.env

2. Add the following to `.gitignore`

        # Environment configuration
        prod.env

3. Run `yarn add -D dotenv`

4. Insert the following at the top of `nuxt.config.js`:

				const dev = process.env.DEPLOY_ENV !== 'prod'

				require('dotenv').config({
					path: dev ? '.env' : 'prod.env'
				})


### Test configuration

        # Install dependencies
        yarn install
        
        # Test locally
        yarn build:serve

        # Deploy to test project
        yarn buildDeploy