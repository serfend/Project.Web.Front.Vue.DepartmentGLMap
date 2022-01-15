const item_value = (i, field) => {
  const value = i && i.extend_fields[field]
  return (value && value.v) || value
}
export function data_compare({ list, type, value, id }) {
  const callback = type_dict[type]
  if (!callback) {
    console.warn('invalid filter type', type)
    return list
  }
  return callback({ list, value, id })
}
const type_dict = {
  'BaseSelect': data_compare_BaseSelect,
  'el-input': data_compare_string,
  'BaseAdminDivision': data_compare_BaseAdminDivision
}
function data_compare_BaseAdminDivision({ value, list, id }) {
  let code = (value && value.code)
  if (!code) return list
  code = code.replace(/(0+)$/g, '')
  return list.filter(d => {
    const v = `${item_value(d, id)}`
    return v && (v.indexOf(code) === 0)
  })
}
function data_compare_string({ value, list, id }) {
  return list.filter(d => {
    const v = `${item_value(d, id)}`
    return v && (v.indexOf(value) > -1)
  })
}
function data_compare_BaseSelect({ value, list, id }) {
  if (!value.length) return list
  const filter_value_merge = value.reduce((prev, cur) => prev + cur, 0)
  return list.filter(d => Number(filter_value_merge) & Number(item_value(d, id)))
}
