export const mixin = {
  data () {
    return {
      // This is the whitelist of elements that will not trigger the handler.
      // Key is a handler name. Value is an array of elements associated with the handler name (by declaring the directive v-clickoff="handlerName").
      clickoffElements: {},

      // These are the 2 functions that will be triggered by the 2 event listeners and will call the handler.
      // Key is a handler name. Value is the handler function that is executed in response to:
      // - clicking outside of elements associated with the handler name.
      // - pressing the Esc key
      clickoffClickListeners: {},
      clickoffKeyListeners: {}
    }
  },
  directives: {
    clickoff: {
      bind (el, { expression }, vnode) {
        const context = vnode.context
        const data = { // Give this bind() function access to the data
          elements: context.clickoffElements,
          clickListeners: context.clickoffClickListeners,
          keyListeners: context.clickoffKeyListeners
        }
        const handler = expression // The directive passes the handler name in

        // Initialize list of all elements that refer to this handler
        if (!data.elements[handler]) {
          data.elements[handler] = []
        }

        // Add the current element to the list
        data.elements[handler].push(el)

        // Create the function that will be executed by the click listener, if it is not already set
        if (!data.clickListeners[handler]) {
          // Store the function in the data
          data.clickListeners[handler] = (event) => { context.handleClick(event, handler) }

          // Pass a reference to the function to the event listener
          document.addEventListener('click', data.clickListeners[handler])
        }

        // Create the function that will be executed by the keydown listener, if it is not already set
        if (!data.keyListeners[handler]) {
          // Store the function in the data
          data.keyListeners[handler] = (event) => { context.handleKey(event, handler) }

          // Pass a reference to the function to the event listener
          document.addEventListener('keydown', data.keyListeners[handler])
        }
      },
      unbind (el, { expression }, vnode) {
        const context = vnode.context
        const data = { // Give this unbind() function access to the data
          elements: context.clickoffElements,
          clickListeners: context.clickoffClickListeners,
          keyListeners: context.clickoffKeyListeners
        }
        const handler = expression // The directive passes the handler name in

        // Remove the current element from data.elements (the list of elements that are associated with this handler)
        const index = data.elements[handler].indexOf(el)
        if (index > -1) {
          data.elements[handler].splice(index, 1)
        }

        // Remove listeners if there are no more elements for this handler.
        // Since we only added one listener per handler, we need to keep that one listener around until there are no more elements associated with this handler.
        if (data.elements[handler].length === 0) {
          document.removeEventListener('click', data.clickListeners[handler])
          delete data.clickListeners[handler]
          document.removeEventListener('keydown', data.keyListeners[handler])
          delete data.keyListeners[handler]
        }
      }
    }
  },
  methods: {
    handleClick (event, handler) {
      // console.log('clickoff!')
      const whitelist = this.clickoffElements[handler] // List of elements that should not trigger this handler when clicked
      // console.log(whitelist)
      let execute = true // Assume we will execute the handler

      // If the element being clicked (event.target) is in the whitelist, even as a DOM descendant, then do not execute the handler
      whitelist.forEach((element) => {
        // console.log('target', event.target)
        // console.log('contains?', element.contains(event.target))
        if (element.contains(event.target)) {
          execute = false
        }
      })

      if (execute) {
        // console.log('executing')
        this[handler]() // Call the component method. The name of the method is stored in the handler const.
      }
    },
    handleKey (event, handler) {
      if (event.keyCode === 27) { // Esc key
        this[handler]() // Call the component method. The name of the method is stored in the handler const.
      }
    }
  }
}
