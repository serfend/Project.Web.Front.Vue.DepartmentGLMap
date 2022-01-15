import { formatSciItem } from '@/utils/math'
import { arrayToDict } from '@/utils'
import store from '@/store'
export function build_scatter({ data, group }) {
  const r = {
    type: 'effectScatter',
    coordinateSystem: 'geo',
    name: group.alias,
    data,
    symbolSize: v => v[2],
    encode: { value: 2 },
    showEffectOn: 'render',
    rippleEffect: { brushType: 'stroke' },
    itemStyle: {
      opacity: 1,
      shadowBlur: 10,
      shadowColor: '#333'
    },
    blur: {
      labelLine: {
        show: true
      }
    },
    zlevel: 1
  }
  if (group.color)r.itemStyle.color = group.color
  r.label = {
    formatter: '{b}',
    position: 'right',
    show: true
  }
  r.tooltip = {
    scale: true,
    formatter: (a, b, c) => {
      return format_tooltip(a, b, c)
    }
  }
  return r
}

export function format_sci(node) {
  const f = formatSciItem(node)
  return `${f.value}${f.suffix}B`
}
const global_cache = {
  node: {}
}
function get_headers_dict() {
  if (!global_cache.headers_dict || global_cache.headers_dict.length) {
    const fields = store.state.common_fields.fields
    if (!fields) return []
    const headers = fields.list && fields.list.filter(i => !i.hidden)
    global_cache.headers_dict = arrayToDict(headers || [])
  }
  return global_cache.headers_dict
}
function format_tooltip(params, ticket, async_callback) {
  let result = null
  while (!global_cache.node[ticket]) {
    const raw = params.data.value
    const r = []
    r.push(`${params.marker}${params.data.name}<hr/>`)
    const data = raw && raw[4]
    if (!data) {
      r.push('无数据')
      result = r.join('')
      break
    }
    const headers = get_headers_dict()
    const detail_info = formatter_build_table(Object.keys(headers), [data], headers)
    r.push(detail_info)
    result = r.join('')
    break
  }
  if (result) {
    global_cache.node[ticket] = result
    setTimeout(() => { delete global_cache.node[ticket] }, 1e3)
  }
  return global_cache.node[ticket]
}
function formatter_build_table(headers, list, header_dict) {
  const values_dict = {}
  const headers_desc = headers.map(i => {
    const dict = header_dict[i]
    values_dict[i] = dict && dict.values_dict
    return (dict && dict.alias) || i
  })
  const r = []
  r.push('<table>')
  if (list.length <= 1) {
    r.push(`<tr><th>字段名称</th><th>值</th></tr>`)
    const item = list[0]
    headers.map((h, index) => {
      r.push('<tr>')
      r.push(`<td>${headers_desc[index]}</td>`)
      if (item) { r.push(`<td>${getValue(values_dict[h], h, item)}</td>`) }
      r.push('</tr>')
    })
  } else {
    r.push(`<tr>${headers_desc.map(i => `<th>${i}</th>`).join('')}</tr>`)
    list.map(i => {
      r.push('<tr>')
      const content = headers.map(h => `<td>${getValue(values_dict[h], h, i)}</td>`)
      r.push(content.join(''))
      r.push('</tr>')
    })
    r.push('</table>')
  }

  return r.join('')
}
function getValue(value_dict, header_index, item) {
  const r = value_dict ? value_dict[item[header_index]] : item[header_index]
  if (r.alias) return `${r.color ? getMarker(r.color) : ''}${r.alias}`
  return r || ''
}
function getMarker(color) {
  return `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
}
