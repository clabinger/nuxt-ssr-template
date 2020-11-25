<template functional>
  <div class="container" :class="props.width ? 'width-' + props.width : ''">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
  .width-1 {
    max-width: 300px;
  }
  .width-2 {
    max-width: 500px;
  }
  .width-3 {
    max-width: 650px;
  }
  .width-4 {
    max-width: 800px;
  }
  .width-5 {
    max-width: 1000px;
  }
</style>
