import mock from './index'
const devices_config = {
  '43c5eeec-ff29-4c88-a8ff-5822d87e4a42': {
    active: true,
    join_cluste: true,
    payload: 1,
    expand_range: [15, 60],
    restarting: false,
    mode: 1
  },
  'e71d219b-d6f5-4a42-ae2c-060de6790cb2': {
    active: true,
    join_cluste: true,
    payload: 1,
    expand_range: [10, 60],
    restarting: false,
    mode: 1
  },
  '8e8b9ba4-b883-4e14-b80f-b337c5e52bc4': {
    active: true,
    join_cluste: true,
    payload: 3,
    expand_range: [20, 70],
    restarting: false,
    mode: 1
  },
  '691c397c-39ad-4ec1-a34b-e27afa496838': {
    active: true,
    join_cluste: false,
    payload: 4,
    expand_range: [20, 80],
    restarting: false,
    mode: 1
  },
}

const devices = function (date) {
  date = date || new Date()
  date = new Date(date)
  const m = (date.getMinutes() + date.getHours() * 100) % 83
  const s = (date.getSeconds() + date.getMinutes() * 100) % 83
  return [
    {
      id: '43c5eeec-ff29-4c88-a8ff-5822d87e4a42',
      name: '数据中心入口流量设备',
      network: {
        ip: '1.1.30.1',
        mac: '2A:B5:FE:46:E6:1C'
      },
      system: 'Ubuntu 20.04.1 LTS',
      runtime: [
        {
          name: 'CPU使用率',
          current: Math.floor(22 + Math.floor(m * 0.4 + Math.random() * 5)),
          color: '#00ffff'
        },
        {
          name: '内存使用率',
          current: Math.floor(3152511115 + m * 10e6 + s * Math.random() * 10e4 + 5 * 10e4),
          total: 15268713416,
          color: '#ff0000'
        }, {
          name: '磁盘使用率',
          current: Math.floor(15021251441236 + m * 3 * 10e5 + Math.random() * 10e7),
          total: 27284841053187,
          color: '#00ff00'
        }
      ],
      traffic: [
        {
          name: '发出数据包',
          current: Math.floor(Math.random() * 10e4 + s * 3 * 10e2),
          color: '#ffff00'
        },
        {
          name: '接收数据包',
          current: Math.floor(Math.random() * 10e4 * 2.2 + s * 8.43 * 10e2),
          color: '#ff0000'
        }, {
          name: '接收流量',
          current: Math.floor(Math.random() * 10e6 * 1.5 + s * 4.23 * 10e3),
          color: '#00ffff'
        }, {
          name: '发出流量',
          current: Math.floor(Math.random() * 10e6 * 1.1 + s * 5.24 * 10e3),
          color: '#00ff00'
        }
      ]
    },
    {
      id: 'e71d219b-d6f5-4a42-ae2c-060de6790cb2',
      name: '应用服务区流量设备',
      network: {
        ip: '1.1.30.2',
        mac: '6F:9A:1B:E3:2C:F9'
      },
      system: 'Ubuntu 20.04.1 LTS',
      runtime: [
        {
          name: 'CPU使用率',
          current: 12 + Math.floor(m * 0.36 + Math.random() * 5),
        },
        {
          name: '内存使用率',
          current: Math.floor(1751511115 + m * 10e6 + s * Math.random() * 3 * 10e4 + 5 * 10e4),
          total: 15268713416,
        }, {
          name: '磁盘使用率',
          current: Math.floor(15331251441236 + m * 3 * 10e5 + Math.random() * 10e7),
          total: 27284841053187,
        }
      ],
      traffic: [
        {
          name: '发出数据包',
          current: Math.floor(Math.random() * 10e4 + s * 3 * 10e2),
          color: '#ff0000'
        },
        {
          name: '接收数据包',
          current: Math.floor(Math.random() * 10e4 * 2.2 + s * 5.43 * 10e2),
          color: '#ff0000'
        }, {
          name: '接收流量',
          current: Math.floor(Math.random() * 10e6 * 1.5 + s * 4.23 * 10e3),
          color: '#00ff00'
        }, {
          name: '发出流量',
          current: Math.floor(Math.random() * 10e6 * 1.2 + s * 5.24 * 10e3),
          color: '#00ff00'
        }
      ]
    },
    {
      id: '8e8b9ba4-b883-4e14-b80f-b337c5e52bc4',
      name: '客户端流量设备',
      network: {
        ip: '1.1.14.1',
        mac: '97:C7:FB:B0:5B:A9'
      },
      system: 'Ubuntu 20.04.1 LTS',
      runtime: [
        {
          name: 'CPU使用率',
          current: 35 + Math.floor(m * 0.32 + Math.random(0, 5)),
        },
        {
          name: '内存使用率',
          current: Math.floor(6442511115 + m * 10e6 + s * Math.random() * 3 * 10e4 + 5 * 10e4),
          total: 15268713416,
        }, {
          name: '磁盘使用率',
          current: Math.floor(15271251441236 + m * 3 * 10e5 + Math.random() * 10e7),
          total: 27284841053187,
        }
      ],
      traffic: [
        {
          name: '发出数据包',
          current: Math.floor(Math.random() * 10e4 + s * 3.81 * 10e2),
          color: '#ff0000'
        },
        {
          name: '接收数据包',
          current: Math.floor(Math.random() * 10e4 + s * 4.13 * 10e2),
          color: '#ff0000'
        }, {
          name: '接收流量',
          current: Math.floor(Math.random() * 10e6 * 1.2 + s * 9.23 * 10e3),
          color: '#00ff00'
        }, {
          name: '发出流量',
          current: Math.floor(Math.random() * 10e6 * 1.5 + s * 15.24 * 10e3),
          color: '#00ff00'
        }
      ]
    },
    {
      id: '691c397c-39ad-4ec1-a34b-e27afa496838',
      name: '集群监控',
      network: {
        ip: '1.1.62.1',
        mac: 'CB:75:72:AA:29:D0'
      },
      system: 'Window Server 2008 R2',
      runtime: [
        {
          name: 'CPU使用率',
          current: Math.floor(Math.floor(m * 0.35 + Math.random() * 5)),
        },
        {
          name: '内存使用率',
          current: Math.floor(6442511115 + m * 10e6 + s * Math.random(Math.random) * 10e4 + 5 * 10e4),
          total: 15268713416,
        }, {
          name: '磁盘使用率',
          current: Math.floor(71251441236 + m * 3 * 10e5 + Math.random() * 10e7),
          total: 9313225746154,
        }
      ],
      traffic: [
        {
          name: '发出数据包',
          current: Math.floor(Math.random() * 10e3 * 3.5 + s * 2.12 * 10e1),
          color: '#ff0000'
        },
        {
          name: '接收数据包',
          current: Math.floor(Math.random() * 10e3 * 3.5 + s * 8.24 * 10e1),
          color: '#ff0000'
        }, {
          name: '接收流量',
          current: Math.floor(Math.random() * 10e5 * 3.5 + s * 1.23 * 10e2),
          color: '#00ff00'
        }, {
          name: '发出流量',
          current: Math.floor(Math.random() * 10e5 * 1.1 + s * 3.24 * 10e2),
          color: '#00ff00'
        }
      ]
    }
  ]
}
export default {
  'get|/devices/list': option => (
    mock.toResult(devices().map(i => ({ name: i.name, id: i.id, config: devices_config[i.id] })))
  ),
  'get|/devices/detail': option => {
    const id = mock.getUrlParam(option.url, 'id')
    const r = Object.assign({ config: devices_config[id] }, devices().find(i => i.id === id))
    return mock.toResult(r)
  },
  'get|/devices/summary': option => {
    const date = mock.getUrlParam(option.url, 'date')
    return mock.toResult(devices(date))
  }
}
