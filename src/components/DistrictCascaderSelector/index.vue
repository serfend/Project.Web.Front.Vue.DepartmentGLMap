<template>
  <CascaderSelector
    v-model="district"
    :child-getter-method="locationChildren"
    :value-name="'code'"
    :label-name="'name'"
    style="width:20rem"
  />
</template>

<script>
export default {
  name: 'DistrictCascaderSelector',
  components: {
    CascaderSelector: () => import('@/components/CascaderSelector')
  },
  data: () => ({
    district: null
  }),
  computed: {
    locations() {
      return this.$store.state.dashboard.locations
    },
    children_dict() {
      return this.locations && this.locations.children
    },
    location_dict() {
      return this.locations && this.locations.locations
    }
  },
  methods: {
    locationChildren(e) {
      return new Promise((res, rej) => {
        const list = this.locationChildrenInner(e)
        if (!list) return rej()
        return res({
          list,
        })
      })
    },
    locationChildrenInner(e) {
      const c_d = this.children_dict
      const l_d = this.location_dict
      if (!c_d || !l_d) return null
      if (e === 'root')e = '0'
      const children = c_d[e]
      if (!children) return null
      return children.map(i => l_d[i])
    }
  }
}
</script>
