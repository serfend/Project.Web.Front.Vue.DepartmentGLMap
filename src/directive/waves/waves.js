import './waves.css'

const context = '@@wavesContext'

function handleClick(el, binding) {
  const elements = []
  function handle(e) {
    const opts = Object.assign({
      ele: el, // 波纹作用元素
      type: 'hit', // hit 点击位置扩散 center中心点扩展
      color: 'rgba(0, 0, 0, 0.15)' // 波纹颜色
    }, binding.value)
    const target = opts.ele
    if (!target) return
    target.style.position = 'relative'
    target.style.overflow = 'hidden'
    const rect = target.getBoundingClientRect()
    let i = elements.findIndex(i => !i.running)
    let item
    if (i === -1) {
      item = document.createElement('span')
      item.style.height = item.style.width = Math.max(rect.width, rect.height) + 'px'
      item.id = new Date().getTime()
      elements.push(item)
      i = elements.length - 1
      target.appendChild(item)
    }
    item = elements[i]
    if (!item.running_timer) {
      item.running_timer = setTimeout(() => {
        item.running = false
        item.running_timer = null
      }, 2e3)
    }
    if (!item.clear_timer) {
      item.clear_timer = setTimeout(() => {
        target.removeChild(item)
        elements.splice(elements.findIndex(x => x.id === item.id), 1)
      }, 10e3)
    }
    item.running = true
    item.className = 'waves-ripple'
    let y, x
    switch (opts.type) {
      case 'center':
        y = rect.height / 2 - item.offsetHeight / 2
        x = rect.width / 2 - item.offsetWidth / 2
        break
      default: {
        const de = document.documentElement
        const db = document.body
        y = (e.pageY - rect.top - item.offsetHeight / 2 - de.scrollTop || db.scrollTop)
        x = (e.pageX - rect.left - item.offsetWidth / 2 - de.scrollLeft || db.scrollLeft)
      }
    }
    item.style.top = `${y}px`
    item.style.left = `${x}px`
    item.style.backgroundColor = opts.color
    item.className = 'waves-ripple z-active'
    return false
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

export default {
  bind(el, binding) {
    el.addEventListener('click', handleClick(el, binding), false)
  },
  update(el, binding) {
    el.removeEventListener('click', el[context].removeHandle, false)
    el.addEventListener('click', handleClick(el, binding), false)
  },
  unbind(el) {
    el.removeEventListener('click', el[context].removeHandle, false)
    el[context] = null
    delete el[context]
  }
}
