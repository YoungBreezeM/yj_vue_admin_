import Layout from '@/layout'

const communityRouter = {
  path: '/communityModule',
  name: '社区模块',
  component: Layout,
  meta: {
    title: '社区模块',
    icon: 'el-icon-chat-round',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/gua/index'),
      name: '信息管理',
      meta: { title: '信息管理', icon: 'form',  }
    },
    {
      path: 'category',
      component: () => import('@/views/community/index'),
      name: '社区分类',
      meta: { title: '社区分类', icon: 'form',  }
    }
  ]
}


export default communityRouter
