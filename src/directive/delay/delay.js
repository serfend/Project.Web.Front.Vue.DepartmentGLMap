const context = '@@delayContext'

function callbackMethod (el, value) {
  let lastTimer = null
  let currentIsHideStatus = true
  function handle (e) {
    const opts = Object.assign({
      time: 5e3, // 定时时间
      callback: () => { console.warn('delay callback is undefined') }, // 当定时达到后的回调
      checker: (element) => true, // 当定时达到后首先检查是否满足回调条件
      el,
    }, typeof (value) === 'function' ? { callback: value } : value)
    clearTimeout(lastTimer)
    lastTimer = setTimeout(() => {
      if (!opts.checker(e)) return
      if (currentIsHideStatus) return
      currentIsHideStatus = true
      return opts.callback({ e, isHide: true })
    }, opts.time)
    if (!currentIsHideStatus) return
    currentIsHideStatus = false
    return opts.callback({ e, isHide: false })
  }

  if (!el[context]) {
    el[context] = {
      removeHandle: handle
    }
  } else {
    el[context].removeHandle = handle
  }

  return handle
}

/**
 * 每次都构建新实例以安全导出
 *
 * @return {*}
 */
const safe_package = () => {
  let callback_event = 'mousemove'
  const r = {
    bind (el, binding) {
      callback_event = binding.callback_event || callback_event
      el.addEventListener(callback_event, callbackMethod(el, binding.value), false)
    },
    update (el, binding) {
      el.removeEventListener(callback_event, el[context].removeHandle, false)
      el.addEventListener(callback_event, callbackMethod(el, binding.value), false)
    },
    unbind (el) {
      el.removeEventListener(callback_event, el[context].removeHandle, false)
      el[context] = null
      delete el[context]
    }
  }
  return r
}
export default safe_package()
