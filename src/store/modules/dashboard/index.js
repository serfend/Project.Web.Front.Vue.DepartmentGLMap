export function loadSettingString(name) {
  return localStorage.getItem(`dashboard.setting[${name}]`)
}
import { memberCardDefault } from './memberCard'
export function createSetting() {
  return {
    color: {
      __setting: {
        default: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'], // 父设置
        type: () => import('@/components/ColorsPicker')
      },
      value: {
        memberCard: {
          value: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'], // 子设置
          label: '地图序列',
          type: () => import('@/components/ColorsPicker'),
          __setting: {
            useParent: true // 是否继承父设置
          }
        },
        barChart: {
          value: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'],
          label: '主图',
          type: () => import('@/components/ColorsPicker'),
          __setting: {
            useParent: true // 是否继承父设置
          }
        }
      },
      label: '配色'
    },
    dateRange: {
      value: {
        start: {
          value: new Date(new Date() - 7 * 86400000),
          label: '开始时间',
          type: 'el-date-picker',
          __setting: {
            props: {
              format: 'yyyy年MM月dd日',
              'value-format': 'yyyy-MM-dd'
            }
          }
        },
        end: {
          value: new Date(),
          label: '结束时间',
          type: 'el-date-picker',
          __setting: {
            props: {
              format: 'yyyy年MM月dd日',
              'value-format': 'yyyy-MM-dd'
            }
          }
        }
      },
      label: '统计时间'
    },
    memberCard: memberCardDefault()
  }
}
