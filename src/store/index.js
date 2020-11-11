export const state = function () {
  const url = 'https://' + process.env.APP_DOMAIN

  return {
    websiteTitle: process.env.APP_TITLE,
    websiteUrl: url,
    websiteSocialImage: url + '/static/social-image.png',
    navMenu: false,
    navProfileMenu: false
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
  }
}
