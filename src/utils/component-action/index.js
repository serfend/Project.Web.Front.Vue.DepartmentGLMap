
export function refsDoAction(refs, componentMethod) {
  for (var component of Object.keys(refs)) {
    const c = refs[component]
    componentMethod(c)
  }
}
