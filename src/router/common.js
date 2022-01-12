export default [
  {
    path: '/redirect',
    component: () => import('@/layout'),
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  }, {
    path: '/markdown',
    component: () => import('@/views/ApplyStream/components/ApplyStreamAbout'),
    hidden: true
  }, {
    path: '/contactme',
    component: () => import('@/components/ContactMe'),
    hidden: true
  }, {
    path: '/qrCodeGenerate',
    component: () => import('@/components/ContactMe/QrCodeGenerate'),
    hidden: true
  }, {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  }, {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }, {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }, {
    path: '',
    hidden: true,
    component: () => import('@/views/welcome')
  }, {
    path: '/about/version',
    component: () => import('@/views/UpdateRecord/VersionDisplay'),
    hidden: true,
    name: 'versionDisplay',
    meta: {
      title: 'about.version.title',
      icon: 'fanhuima'
    }
  }
]
