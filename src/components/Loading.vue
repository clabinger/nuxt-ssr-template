<template functional>
  <div :class="{ 'full': props.fullpage }" class="aligner">
    <div class="aligned">
      <img src="~/static/logo-animated.svg" alt="Loading...">
      <p class="progress-wrapper">
        <progress class="progress is-primary" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fullpage: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
div.aligner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  progress {
    width: 100px;
    height: 2px;
  }
  p.progress-wrapper {
    margin-top: 20px;
  }
  img {
    width: 60px;
  }
}
div.aligner.full {
  min-height: 400px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  progress {
    width: 200px;
    height: 3px;
  }
  p.progress-wrapper {
    margin-top: 50px;
  }
  img {
    width: 100px;
  }
}
div.aligned {
  position: relative;
  display: block;
  text-align: center;
}
img {
  opacity: 0.9;
}
</style>
