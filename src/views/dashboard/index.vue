<template>
  <div class="dashboard-container">
    <Statistics />
  </div>
</template>

<script>
import Statistics from './Statistics'

export default {
  name: 'Dashboard',
  components: { Statistics },
  mounted() {
    this.$store.dispatch('common_fields/init')
  }
}
</script>
