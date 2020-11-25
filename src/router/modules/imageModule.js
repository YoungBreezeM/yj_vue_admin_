import Layout from '@/layout'

const imageModuleRouter = {
  path: '/imageModule',
  name: '图片模块',
  component: Layout,
  meta: {
    title: '图片模块',
    icon: 'el-icon-picture',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/imagesManagement/index'),
      name: '图片管理',
      meta: { title: '图片管理', icon: 'form',  }
    },
    {
      path: 'category',
      component: () => import('@/views/imagesManagement/category/imagesCategory'),
      name: '图片分类',
      meta: { title: '图片分类', icon: 'form',  }
    }
  ]
}


export default imageModuleRouter
