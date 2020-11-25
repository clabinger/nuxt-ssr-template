<template>
  <div>
    <div class="section">
      <Container :width="width">
        <div v-if="title" class="content">
          <h1>{{ title }}</h1>
        </div>
        <slot />
      </Container>
    </div>
  </div>
</template>

<script>
import Container from '~/components/Container.vue'

export default {
  components: {
    Container
  },
  props: {
    title: {
      type: String,
      default: null
    },
    width: {
      type: String,
      default: null
    }
  }
}
</script>
