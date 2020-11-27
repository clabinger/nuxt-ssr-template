<template>
  <div>
    <nav role="navigation" aria-label="main navigation" :class="{'is-scrolled': scrolled}">
      <div class="nav-brand">
        <nuxt-link to="/" class="nav-item no-hover" @click.native="handleLink">
          <img src="~/static/logo-title.png" :alt="websiteTitle">
        </nuxt-link>
      </div>
      <div class="nav-burger">
        <a
          v-clickoff="closeNavMenu"
          class="nav-item"
          role="button"
          aria-label="Menu"
          :aria-expanded="!!active ? 'true' : 'false'"
          data-target="navbar-menu"
          @click="toggleNavMenu"
        >
          <b-icon icon="bars" />
          <span>MENU</span>
        </a>
      </div>

      <div id="navbar-menu" v-clickoff="closeNavMenu" class="nav-menu" :class="{'is-active': active}">
        <div class="nav-start">
          <nuxt-link
            v-for="link in visibleLinks"
            :key="link.url"
            :to="link.url"
            :active-class="link.url === '/' ? 'false' : 'is-current-page'"
            exact-active-class="is-current-page"
            class="nav-item"
            @click.native="handleLink"
          >
            {{ link.name }}
          </nuxt-link>
        </div>
        <hr class="nav-parts-separator">
        <div class="nav-end">
          <template v-if="hydrated && user">
            <a
              v-clickoff="closeNavProfileMenu"
              class="nav-item no-hover nav-profile-link"
              :class="{'is-active': profileActive}"
              role="button"
              aria-label="Account Menu"
              :aria-expanded="!!profileActive ? 'true' : 'false'"
              data-target="navbar-profile-menu"
              @click="toggleNavProfileMenu"
            >
              <img class="profile-image" :src="user.photoURL" :alt="user.displayName">
            </a>
            <div id="navbar-profile-menu" v-clickoff="closeNavProfileMenu" class="nav-profile-menu" :class="{'is-active': profileActive}">
              <img class="profile-image nav-profile-display" :src="user.photoURL" :alt="user.displayName">
              <p class="nav-username">
                {{ user.displayName }}
              </p>
              <hr class="nav-parts-separator">
              <nuxt-link to="/profile" class="nav-item" @click.native="handleLink">
                <b-icon icon="user" />
                <span>Profile</span>
              </nuxt-link>
              <nuxt-link to="/settings" class="nav-item" @click.native="handleLink">
                <b-icon icon="cog" />
                <span>Settings</span>
              </nuxt-link>
              <a class="nav-item" @click="signOut">
                <b-icon icon="sign-out-alt" />
                <span>Sign out</span>
              </a>
            </div>
          </template>
          <nuxt-link v-else class="nav-item nav-item-text" to="#sign-in">
            Sign in
          </nuxt-link>
        </div>
      </div>
    </nav>
    <div class="buffer" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { mixin as clickoff } from '~/mixins/clickoff'

export default {
  mixins: [clickoff],
  data () {
    return {
      scrolled: false
    }
  },
  computed: {
    ...mapState([
      'websiteTitle',
      'hydrated'
    ]),
    ...mapState('auth', [
      'user'
    ]),
    ...mapState({
      active: 'navMenu',
      profileActive: 'navProfileMenu'
    }),
    ...mapGetters('pages', [
      'visibleLinks'
    ])
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    ...mapActions('auth', [
      'signOut'
    ]),
    ...mapMutations([
      'toggleNavMenu',
      'toggleNavProfileMenu',
      'closeAllMenus',
      'closeNavMenu',
      'closeNavProfileMenu'
    ]),
    handleScroll (e) {
      this.scrolled = window.scrollY > 10
    },
    handleLink () {
      window.scrollTo(0, 0)
      this.closeAllMenus()
    }
  }
}
</script>

<style lang="scss" scoped>

  $breakpoint: 680px;
  $nav-background: darken($white, 0%);
  $nav-text: darken($text, 0%);
  $nav-border: darken($nav-background, 5%);
  $image-height: 1.7rem;

  nav, .nav-brand, .nav-burger, .nav-menu, .nav-start, .nav-end {
    display: flex;
    align-content: stretch;
  }
  .nav-menu, .nav-burger, .nav-start {
    flex-grow: 1;
  }

  // Main navbar
  nav {
    &.is-scrolled {
      box-shadow: 0px 1px 2px 0px rgba(darken($nav-background, 20%), .3), 0px 1px 3px 1px rgba(darken($nav-background, 20%), .15);
    }
    transition: box-shadow 0.3s ease-in-out;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 30;
    background-color: $nav-background;
  }

  // Brand
  .nav-brand {
    flex-shrink: 0;
    img {
      height: $image-height;
    }
  }

  // Hamburger menu button
  .nav-burger {
    @include from($breakpoint - 1px) {
      display: none;
    }
    justify-content: flex-end;
    font-size: 0.85em;
  }

  // Profile menu button / profile image
  .nav-profile-link.nav-item { // .nav-item for specificity
    @include until($breakpoint) {
      display: none;
    }
  }
  .nav-profile-display {
    @include from($breakpoint - 1px) {
      display: none;
    }
  }

  .profile-image {
    border-radius: 50%;
    pointer-events: none;
    object-fit: cover;

    @include until($breakpoint) {
      width: 3rem;
      height: 3rem;
      justify-self: center;
      margin: 1rem auto 0.5rem;
      display: block;
    }

    @include from($breakpoint - 1px) {
      height: $image-height;
      width: $image-height;
    }
  }

  .nav-username {
    display: block;
    font-weight: 500;
    @include until($breakpoint) {
      text-align: center;
    }
  }

  // Dropdowns
  @mixin dropdown {
    position: absolute;
    right: 0;
    background-color: $nav-background;
    min-width: 10rem;
    border-bottom-left-radius: $radius;
    border-top-left-radius: $radius;
    box-shadow: 0px 1px 2px 0px rgba(darken($nav-background, 20%), .3), 0px 1px 3px 1px rgba(darken($nav-background, 20%), .15);
    top: 100%;
    &:not(.is-active) {
      visibility: hidden;
      opacity: 0;
    }
    // Only animate when becoming visible (fade in but don't fade out)
    &.is-active {
      transition: opacity .1s ease-in-out, visibility .1s ease-in-out;
    }
  }

  // Main menu dropdown
  .nav-menu {
    .nav-parts-separator {
      border-top: 1px solid $nav-border;
      margin: 0.25em 0;
    }
    @include until($breakpoint) {
      @include dropdown;
      overflow: hidden;
      display: flex;
      flex-direction: column-reverse;
      .nav-start, .nav-end {
        display: block;
      }
    }
    @include from($breakpoint - 1px) {
      &>.nav-parts-separator {
        display: none;
      }
    }
  }

  .nav-profile-menu {
    @include from($breakpoint - 1px) {
      @include dropdown;
    }
  }

  // Nav items
  .nav-item {
    display: flex;
    align-items: center;
    color: $nav-text;
    transition: border-radius 0.3s ease-in-out;
    padding: 0.5rem;
    &.is-current-page {
      background-color: $primary;
      color: $white;
    }
  }

  a.nav-item:hover:not(.is-current-page):not(.no-hover) {
    background-color: $nav-border;
  }

  // Nav item padding
  .nav-brand .nav-item,
  .nav-profile-menu .nav-item,
  .nav-username {
    padding: 0.5rem 1rem;
  }

  .nav-start .nav-item, .nav-item.nav-item-text {
    padding: 0.5rem 1.5rem;
    @include from(725px) {
      padding: 0.5rem 2rem;
    }
  }

  // Rounded corners on nav items
  nav:not(.is-scrolled) {
    .nav-brand .nav-item {
      border-bottom-right-radius: $radius;
    }

    @include from($breakpoint - 1px) {
      .nav-start .nav-item {
        border-bottom-left-radius: $radius;
        border-bottom-right-radius: $radius;
      }
      .nav-end .nav-item {
        border-bottom-left-radius: $radius;
      }
    }

    .nav-burger .nav-item:not(.is-active) {
      border-bottom-left-radius: $radius;
    }
  }

  // Don't let content hide under the navbar (since it's fixed)
  .buffer {
    // image height + padding top + padding bottom
    height: calc(#{$image-height} + 0.6rem + 0.6rem);
  }

  .icon:not(:last-child) {
    margin-right: 0.6rem;
  }
  .icon:not(:first-child) {
    margin-left: 0.6rem;
  }
</style>
