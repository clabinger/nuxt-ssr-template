<template>
  <div>
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
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
    ])
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
