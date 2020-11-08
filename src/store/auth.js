export const state = () => ({
  user: null,
  status: {
    loaded: false,
    error: false,
    pending: false
  }
})

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setLoaded (state, payload) {
    state.status.loaded = payload
  },
  setError (state, payload) {
    state.status.error = payload
  },
  setPending (state, payload) {
    state.status.pending = payload
  }
}

export const getters = {
  requestedSignIn: (state, getters, rootState) => process.client && rootState.route.hash === '#sign-in'
}

export const actions = {
  async signIn ({ commit }, method) {
    commit('setPending', true)
    const provider = method === 'facebook' ? new this.$fireModule.auth.FacebookAuthProvider() : new this.$fireModule.auth.GoogleAuthProvider()
    try {
      await this.$fire.auth.signInWithPopup(provider)
      // commit('closeAllMenus', null, { root: true }) // TODO implement menus
    } catch (error) {
      commit('setError', 'There was an error processing your sign in. Please try again.')
    }
    commit('setPending', false)
  },
  signOut ({ commit, dispatch }) {
    this.$fire.auth.signOut()
      .finally(() => {
        // commit('closeAllMenus', null, { root: true }) // TODO implement menus
        dispatch('clearSignInErrors')
        this.$router.push({ path: '/' })
      })
  },

  clearSignInErrors ({ commit }) {
    commit('setError', null)
  },

  async updateUser ({ dispatch }, user) {
    const newValues = {}

    if (user.displayName) {
      newValues.displayName = user.displayName
    }
    if (user.photoURL) {
      newValues.photoURL = user.photoURL
    }

    await this.$fire.auth.currentUser.updateProfile(newValues)
    dispatch('loadUser', this.$fire.auth.currentUser)
  },

  loadUser ({ commit, getters, rootState }, { authUser, claims }) {
    commit('setUser', !authUser ? null : Object.pick(authUser, [
      'displayName',
      'email',
      'uid',
      'photoURL'
    ]))

    if (authUser && getters.requestedSignIn) {
      // Successfully signed in, remove URL hash
      this.app.router.replace(rootState.route.path)
    }

    // commit('closeAllMenus', null, { root: true }) // TODO implement menus
    commit('setLoaded', true)
  }
}
