<template>
  <div class="login-wrap">
    <div class="login-main">
      <div class="section">
        <Container width="2">
          <div class="image-wrap my-5">
            <img src="~/static/logo-title.png" :alt="websiteTitle">
          </div>

          <div class="content has-text-centered my-5">
            <p class="is-size-5">
              Please sign in:
            </p>
          </div>

          <!-- Wrap login buttons in container for loading spinner -->
          <div class="loading-wrap">
            <!-- This div is just for centering within .loading-wrap - it wraps all of the below elements into one -->
            <div>
              <div v-if="status.error" class="has-text-centered notification is-warning my-3">
                <p>{{ status.error }}</p>
              </div>
              <button class="button is-fullwidth is-google my-3" @click="signIn('google')">
                <b-icon pack="fab" icon="google" />
                <span>Sign in with Google</span>
              </button>
              <button class="button is-fullwidth is-facebook my-3" @click="signIn('facebook')">
                <b-icon pack="fab" icon="facebook-f" />
                <span>Sign in with Facebook</span>
              </button>
              <nuxt-link v-if="requestedSignIn" class="button is-fullwidth my-3" to="" @click.native="clearSignInErrors">
                Cancel
              </nuxt-link>
            </div>
            <b-loading :is-full-page="false" :active="status.pending" />
          </div>
        </Container>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Container from '~/components/Container.vue'

export default {
  components: {
    Container
  },
  computed: {
    ...mapState([
      'websiteTitle'
    ]),
    ...mapState('auth', [
      'status'
    ]),
    ...mapGetters('auth', [
      'requestedSignIn'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'clearSignInErrors',
      'signIn'
    ])
  }
}
</script>

<style lang="scss" scoped>
  div.login-wrap {
    display: flex;
    height: 100%;
    align-items: center;
  }

  div.login-main {
    flex-grow: 1;
  }

  div.loading-wrap {
    position: relative;
    min-height: 3rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    &>div{
      width: 100%;
    }
  }

  img {
    margin: 0 auto;
    display: block;
    max-width: 100%;
    @include until($desktop) {
      width: 200px;
    }
    @include from($desktop) {
      width: 300px;
    }
  }

.is-google {
  $color: $red;
  background-color: $color;
  &:hover { background-color: darken($color, 5%) }
}
.is-facebook {
  $color: $blue;
  background-color: $color;
  &:hover { background-color: darken($color, 5%) }
}
.is-google, .is-facebook {
  color: $white;
}
</style>
