export default {
  path: '/home',
  component: () => import('@/views/dashboard/container'),
  name: 'dataCenter',
  redirect: '/',
  meta: {
    title: 'home.title',
    icon: 'duoqudaojicheng'
  },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/dashboard'),
      name: 'Dashboard',
      meta: {
        title: 'dashboard.title',
        icon: 'wangluocuowushuai',
        removeHeader: true
      },
    },
    {
      path: 'data-center',
      component: () => import('@/views/DataAI/DataCenter'),
      name: 'dataCenter',
      meta: {
        title: 'data-center.title',
        icon: 'duoqudaojicheng'
      }
    },
    {
      path: 'model-config',
      component: () => import('@/views/DataAI/ModelConfig'),
      name: 'modelConfig',
      meta: {
        title: 'model-config.title',
        icon: 'APIceshi'
      }
    },
    {
      path: 'warning',
      component: () => import('@/views/DataAI/Warning'),
      name: 'Warning',
      meta: {
        title: 'warning.title',
        icon: 'anquan'
      }
    }
  ]
}
