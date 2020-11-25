import Layout from '@/layout'

const videoModuleRouter = {
  path: '/videoModule',
  name: '视频模块',
  component: Layout,
  meta: {
    title: '视频模块',
    icon: 'el-icon-video-camera',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/video/index'),
      name: '视频管理',
      meta: { title: '视频管理', icon: 'form', }
    },
    {
      path: 'category',
      component: () => import('@/views/video/category/index'),
      name: '视频分类',
      meta: { title: '视频分类', icon: 'form', }
    }
  ]
}


export default videoModuleRouter
