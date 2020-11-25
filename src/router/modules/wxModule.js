import Layout from '@/layout'

const wxModuleRouter = {
  path: '/wxModule',
  name: '客户模块',
  component: Layout,
  meta: {
    title: '客户模块',
    icon: 'wechat',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/client/index'),
      name: '客户管理',
      meta: { title: '客户管理', icon: 'form' }
    },
    {
      path: 'gradeManagement',
      component: () => import('@/views/client/grade/index'),
      name: '等级管理',
      meta: { title: '等级管理', icon: 'form', }
    }
  ]
}


export default wxModuleRouter
