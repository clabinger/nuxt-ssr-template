<template>
  <div class="fill-window">
    <div v-show="showMainInterface" class="main-wrap">
      <div class="main-expand">
        <div class="main">
          <Login v-if="showSignIn" />
          <template v-else>
            <Navbar />
            <nuxt />
          </template>
        </div>
      </div>
      <Footer />
    </div>
    <Loading v-if="!showMainInterface" :fullpage="true" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

import Navbar from '~/components/Navbar.vue'
import Login from '~/components/Login.vue'
import Loading from '~/components/Loading.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Loading,
    Login,
    Navbar,
    Footer
  },
  computed: {
    ...mapState([
      'websiteTitle',
      'websiteUrl',
      'websiteSocialImage',
      'hydrated'
    ]),
    ...mapGetters('pages', [
      'isPublic',
      'headTitle',
      'headDescription'
    ]),
    ...mapState('auth', [
      'user'
    ]),
    ...mapState('auth', {
      userLoaded: state => state.status.loaded
    }),
    ...mapGetters('auth', [
      'requestedSignIn'
    ]),
    showMainInterface: state => state.hydrated && state.userLoaded,
    showSignIn: state => state.hydrated && !state.user && (!state.isPublic || state.requestedSignIn)
  },
  middleware: [
    'general'
  ],
  mounted () {
    // Client-side DOM must match SSR output until after hydration is complete
    this.setHydrated(true)
  },
  methods: {
    ...mapMutations([
      'setHydrated'
    ])
  },
  head () {
    return {
      title: this.headTitle,
      meta: [
        // Generated with https://megatags.co/
        // Search Engine
        { hid: 'description', name: 'description', content: this.headDescription },
        { hid: 'image', name: 'image', content: this.websiteSocialImage },
        // Schema.org for Google
        { hid: 'schema-name', itemprop: 'name', content: this.headTitle },
        { hid: 'schema-description', itemprop: 'description', content: this.headDescription },
        { hid: 'schema-image', itemprop: 'image', content: this.websiteSocialImage },
        // Twitter
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
        { hid: 'twitter:title', name: 'twitter:title', content: this.headTitle },
        { hid: 'twitter:description', name: 'twitter:description', content: this.headDescription },
        // Open Graph general (Facebook, Pinterest & Google+)
        { hid: 'og:title', name: 'og:title', content: this.headTitle },
        { hid: 'og:description', name: 'og:description', content: this.headDescription },
        { hid: 'og:image', name: 'og:image', content: this.websiteSocialImage },
        { hid: 'og:url', name: 'og:url', content: this.websiteUrl },
        { hid: 'og:site_name', name: 'og:site_name', content: this.websiteTitle },
        { hid: 'og:type', name: 'og:type', content: 'website' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
div.main-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}

div.main-expand {
  flex-grow: 1;
  flex-direction: row;
  display: flex;
}

div.main {
  flex-grow: 1;
}

.fill-window {
  height: 100%;
}
</style>
