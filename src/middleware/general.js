export default function ({ store }) {
  store.commit('closeAllMenus')
  store.dispatch('auth/clearSignInErrors')
}
