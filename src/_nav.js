import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilCursor,
  cilDrop,
  cilPencil,
  cilPuzzle,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: '기본정보관리',
    to: '/com',
  },
  {
    component: CNavItem,
    name: '공통코드관리',
    to: '/com/CMM1001',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '시험분류관리',
    to: '/com/CMM1002',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Part/Chapther관리',
    to: '/com/CMM1003',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '문제관리',
    to: '/mqn',
  },
  {
    component: CNavItem,
    name: '문제등록',
    to: '/mqn/QMS1001',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },

]

export default _nav
