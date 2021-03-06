import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/Login'
// 导入home组件
import Home from 'components/Home'
// 导入Users组件
import Users from 'components/users/Users'
// 导入Rights组件
import Rights from 'components/rights/Rights'
import Roles from 'components/rights/Roles'
// 导入商品分类组件
import Category from 'components/product/Category'
import Goods from 'components/product/Goods'
import GoodsAdd from 'components/product/Add'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      // 用于配置home的子路由
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Category
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: GoodsAdd
        }
      ]
    }
  ]
})
// 给router对象注册一个导航守卫
// 将来所有的导航（路由发生了跳转）都要经过beforeEach
// to: 去哪儿
// from: 从哪儿
// next: 是否放行  next():表示直接放行   next('/login')表示跳转到/login
router.beforeEach((to, from, next) => {
  // 如果要去登录页，直接放行
  if (to.path === '/login') {
    // 直接放行
    next()
    return
  }
  // 如果不是登录， 判断是否有token，如果有，放行，如果没有，去登录
  let token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
