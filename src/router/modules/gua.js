import Layout from '@/layout'

const guaRouter = {
  path: '/gua',
  component: Layout,
  name: '卦象',
  meta: {
    title: '卦象',
    icon: 'example',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/gua/index'),
      name: '卦相管理',
      meta: { title: '卦相管理', icon: 'form' }
    },
    {
      path: 'yao',
      component: () => import('@/views/yao/index'),
      name: '爻词管理',
      meta: { title: '爻词管理', icon: 'form' }
    },
    {
      path: 'resolve/management',
      name: '卦词解析',
      component: () => import('@/views/prediction/index'),
      meta: { title: '卦词解析', icon: 'form' }

    },
    {
      path: 'resolve/category',
      component: () => import('@/views/prediction/predictionCategory/index'),
      name: '解词分类',
      meta: { title: '解词分类', icon: 'form' }
    }
  ]
}

export default guaRouter
