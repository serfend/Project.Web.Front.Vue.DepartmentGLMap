
/**
 * 将features的坐标和标识全部移动
 *
 * @export
 * @param {*} list
 * @return {*}
 */
export function mergeFeatures (list) {
  return list.map(i => {
    const { room, group } = i
    const size = group.size || 1
    const offset = group.offset || [0, 0]
    const f_list = room.features
    f_list.map(f => {
      const { geometry, properties } = f
      properties.name = i.alias
      const coordinates = geometry.coordinates
      coordinates.map(coordinate => {
        coordinate.map(positions => {
          positions.map(pos => {
            transformPosition(pos, size, offset)
          })
        })
      })
    })
    return f_list
  }).flat()
}
function transformPosition(pos, size, offset) {
  pos[0] *= size
  pos[1] *= size
  pos[0] += (offset[0] || 0)
  pos[1] += (offset[1] || 0)
}
export function mergeSeats (list, positionField) {
  return list.map(i => {
    const { room, group } = i
    const size = group.size || 1
    const offset = group.offset || [0, 0]
    const f_list = room.seats
    f_list.map(f => {
      const { extend_fields } = f
      const pos = extend_fields[positionField]
      if (!pos) return
      transformPosition(pos, size, offset)
    })
    return f_list
  }).flat()
}

/**
 * 合并房间信息并初始化数据
 *
 * @export
 * @param {*} list
 * @param {*} positionField
 * @return {*}
 */
export function mergeRoom (list, positionField) {
  if (!list || !list.length) return null
  const result = {
    features: mergeFeatures(list),
    seats: mergeSeats(list, positionField),
    type: list[0].room.type,
    name
  }
  return result
}
