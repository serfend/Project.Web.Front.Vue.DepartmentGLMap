import lib from './delay'

const install = function(Vue) {
  Vue.directive('delay', lib)
}

if (window.Vue) {
  window['delay'] = lib
  Vue.use(install); // eslint-disable-line
}

lib.install = install
export default lib
