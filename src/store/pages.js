export const state = function () {
  return {
    pages: [
      {
        url: '/',
        name: 'Home',
        displayName: false,
        linkIsPublic: true
      },
      {
        url: '/private',
        name: 'Private Page',
        description: 'Visible to signed-in users'
      },
      {
        url: '/about',
        name: 'About',
        isPublic: true
      }
    ]
  }
}

export const getters = {
  currentPage (state, getters, rootState) {
    const page = state.pages.filter(page => page.url === rootState.route.path)
    return page ? page[0] : null
  },
  headTitle (state, getters, rootState) {
    const page = getters.currentPage
    const usePageName = (page && page.displayName !== false) ? page.name + ' - ' : ''
    return usePageName + rootState.websiteTitle
  },
  headDescription (state, getters) {
    const page = getters.currentPage
    return page && page.description ? page.description : ''
  },
  isPublic (state, getters) {
    const page = getters.currentPage
    return page && page.isPublic
  },
  publicLinks: state => state.pages.filter(page => page.linkIsPublic || page.isPublic),
  visibleLinks (state, getters, rootState) {
    if (rootState.auth.user) {
      return state.pages
    } else {
      return getters.publicLinks
    }
  }
}
