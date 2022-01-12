export function memberCardDefault() {
  return [{
    title: '设备在线',
    description: '流量设备在线数量',
    color: '#00ff00',
    collection: 'main',
    filter: '{return 2;}', // {value += i.to===11?i[card.binding]:0;return value;}
    binding: 'value'
  }, {
    title: '接收流量',
    description: '接收流量',
    color: '#ccccff',
    collection: 'main',
    filter: '{return Math.floor(new Date().getHours() * 1761230 + Math.random() * 1000000 + 55108154)}',
    binding: 'value'
  }, {
    title: '可疑威胁',
    description: '可疑威胁',
    color: '#ff00ff',
    collection: 'main',
    filter: '{return Math.floor(new Date().getHours() * 21.1 + Math.abs(new Date().getSeconds()-30) * Math.random() * 52.2 + 335)}',
    binding: 'value'
  }, {
    title: '活跃主机',
    description: '活跃主机',
    color: '#ffff00',
    collection: 'main',
    filter: '{return Math.floor(new Date().getHours() * 10 + Math.abs(new Date().getSeconds()-30) * Math.random() + 6521)}',
    binding: 'value'
  }, {
    title: '告警主机',
    description: '描述信息',
    color: '#ff0000',
    collection: 'main',
    filter: '{return Math.floor(new Date().getHours() * 1 + Math.abs(new Date().getSeconds()-30) * Math.random() * 0.2 + 25)}',
    binding: 'value'
  }]
}
