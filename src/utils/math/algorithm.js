export function sortby(sort, desc) {
  const v = (sort ? 1 : 0) + (desc ? 2 : 0)
  switch (v) {
    case 0: return (a, b) => a - b
    case 1: return (a, b) => a[sort] - b[sort]
    case 2: return (a, b) => b - a
    case 3: return (a, b) => b[sort] - a[sort]
  }
}

/**
 * 二分法获取合适项
 *
 * @export
 * @param {*} lst
 * @param {*} check_fit
 */
export function dichotomy(lst, check_fit) {
  if (!lst || lst.length === 0) return null
  const lstLen = lst.length - 1
  let result = 0
  let nxtIndex = 0
  while (!check_fit(lst, result)) {
    nxtIndex = Math.floor((result + lstLen) / 2)
    if (result === lstLen + 1 || result === nxtIndex) return result
    result = nxtIndex
  }
  return result
}
