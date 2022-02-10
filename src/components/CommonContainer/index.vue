<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CommonContainer',
  mounted () {
    this.$store.dispatch('common_fields/init')
  }
}
</script>
