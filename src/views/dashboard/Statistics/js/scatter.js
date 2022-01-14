export function build_scatter(data) {
  return {
    type: 'scatter',
    coordinateSystem: 'geo',
    name: 'Top 5',
    data: data,
    symbolSize: function (val) {
      return val[2]
    },
    encode: {
      value: 2
    },
    showEffectOn: 'render',
    rippleEffect: {
      brushType: 'stroke'
    },
    label: {
      formatter: '{b}',
      position: 'right',
      show: true
    },
    itemStyle: {
      opacity: 0.2,
      shadowBlur: 10,
      shadowColor: '#333'
    },
    emphasis: {
      scale: true
    },
    zlevel: 1
  }
}
