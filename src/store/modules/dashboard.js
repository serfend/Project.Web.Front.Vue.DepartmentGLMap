const state = {
  setting: null,
  locations: null,
}
import {
  pairSetting
} from '@/utils/data-handle'
import {
  createSetting, loadSettingString
} from './dashboard/index'
import { loadLocations, loadMap } from '@/api/config/geo'
import * as echarts from 'echarts'
const actions = {
  saveSetting({
    commit,
    state
  }, {
    name,
    setting
  }) {
    localStorage.setItem(`dashboard.setting[${name}]`, JSON.stringify(setting))
  },
  loadLocations({
    commit,
    state
  }) {
    return new Promise((res, rej) => {
      if (state.locations) return res(state.locations)
      loadLocations().then(data => {
        state.locations = data
        return res(data)
      }).catch(e => rej(e))
    })
  },
  loadMap({
    commit,
    state
  }, {
    name, code
  }) {
    return new Promise((res, rej) => {
      const t = echarts.getMap(name)
      if (t) return res(t)
      loadMap(code).then(data => {
        echarts.registerMap(name, data)
        return res(data)
      }).catch(e => rej(e))
    })
  },
  loadSetting({
    commit,
    state
  }, {
    name
  }) {
    return new Promise((res, rej) => {
      const rawSetting = loadSettingString(name)
      if (rawSetting) {
        const s = JSON.parse(rawSetting)
        const newSetting = createSetting()
        pairSetting(newSetting, s)
        state.setting = Object.assign({}, newSetting)
        console.log('setting is load:', name, state.setting, newSetting)
        res(state.setting)
      } else {
        console.log('setting not exist:', name)
        rej()
      }
    })
  },
  init({
    commit,
    state
  }) {
    console.log('create setting')
    state.setting = createSetting()
  }
}

export default {
  namespaced: true,
  state,
  actions
}
