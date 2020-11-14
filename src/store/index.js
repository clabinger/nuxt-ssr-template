export const state = function () {
  const url = 'https://' + process.env.APP_DOMAIN

  return {
    websiteTitle: process.env.APP_TITLE,
    websiteUrl: url,
    websiteSocialImage: url + '/social-image.png',
    navMenu: false,
    navProfileMenu: false,

    // Client-side DOM must match SSR output until after hydration is complete. Set to true in mounted() hook in layout
    hydrated: false
  }
}

export const mutations = {
  closeAllMenus (state) {
    state.navMenu = false
    state.navProfileMenu = false
  },
  toggleNavMenu (state) {
    state.navMenu = !state.navMenu
  },
  toggleNavProfileMenu (state) {
    state.navProfileMenu = !state.navProfileMenu
  },
  closeNavMenu (state) {
    state.navMenu = false
  },
  closeNavProfileMenu (state) {
    state.navProfileMenu = false
  },
  setHydrated (state, payload) {
    state.hydrated = payload
  }
}
