const state = {
  loading: false,
  fields: null,
  data: null
}
import { loadFields, loadDatas } from '@/api/config/common_fields'

const actions = {
  init({
    commit,
    state
  }) {
    if (!state.loading) {
      state.loading = new Promise((res, rej) => {
        if (state.fields && state.data) return res(state)
        const a = loadFields().then(data => {
          state.fields = data
          const list = data.list
          if (!list) return
          list.map(i => {
            if (!i.values) return
            const dict = {}
            i.values.map(item => {
              dict[item.value] = item
            })
            i.values_dict = dict
          })
        })
        const b = loadDatas().then(data => { state.data = data })
        return Promise.all([a, b])
      })
    }
    return state.loading
  }
}

export default {
  namespaced: true,
  state,
  actions
}
