import React from 'react'

const CMM1001 = React.lazy(() => import('./views/pages/CMM1001/CMM1001'))
const CMM1002 = React.lazy(() => import('./views/pages/CMM1002/CMM1002'))
const CMM1003 = React.lazy(() => import('./views/pages/CMM1003/CMM1003'))
const QMS1001 = React.lazy(() => import('./views/pages/QMS1001/QMS1001'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/com', name: '기본정보관리', exact: true },
  { path: '/mqn', name: '문제관리', exact: true },
  { path: '/com/CMM1001', name: '공통코드관리', component: CMM1001 },
  { path: '/com/CMM1002', name: '시험분류관리', component: CMM1002 },
  { path: '/com/CMM1003', name: 'Part/Chapther관리', component: CMM1003 },
  { path: '/mqn/QMS1001', name: '문제등록', component: QMS1001 },
]

export default routes
