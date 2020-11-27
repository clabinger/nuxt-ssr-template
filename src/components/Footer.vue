<template>
  <div>
    <div class="section">
      <div class="container links">
        <!--
          If a sign in error is displayed, and you click on the footer link to the current page, the page will not reload
          (since it's the same route). But we want to clear the error message. `click.native` must be used to catch this.
        -->
        <nuxt-link v-for="link in visibleLinks" :key="link.url" :to="link.url" @click.native="clearSignInErrors">
          {{ link.name }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('pages', [
      'visibleLinks'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'clearSignInErrors'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .section {
    background-color: $background-gray;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  .links a:not(:first-child) {
    margin-left: 1rem;
  }
  .links a:not(:last-child) {
    margin-right: 1rem;
  }
  a {
    color: lighten($text, 15%);
    &:hover {
      color: $text;
    }
  }
</style>
