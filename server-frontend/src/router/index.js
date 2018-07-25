import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
{
  path: '/authredirect',
  component: _import('login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: _import('errorPage/404'),
  hidden: true
},
{
  path: '/401',
  component: _import('errorPage/401'),
  hidden: true
},
{
  path: '',
  component: Layout,
  redirect: 'dashboard'
},
{
  path: '',
  component: Layout,
  redirect: 'dashboard',
  children: [{
    path: 'dashboard',
    component: _import('dashboard/index'),
    name: 'dashboard',
    meta: {
      title: 'dashboard',
      icon: 'dashboard',
      noCache: true
    }
  }]
},
{
  path: '/host',
  component: Layout,
  redirect: '/host/list',
  children: [{
    path: 'list',
    component: _import('host/list'),
    name: 'host',
    meta: {
      title: 'host',
      icon: 'host',
      noCache: true
    }
  }]
}, {
  hidden: true,
  path: '/charts',
  component: Layout,
  redirect: '/charts/link',
  children: [{
    path: 'link/:identity/:hostname/:ip/:depth',
    component: _import('charts/link'),
    name: 'charts-link',
    meta: {
      title: 'chart',
      icon: 'host',
      noCache: true
    }
  }]
}, {
  hidden: false,
  path: '/link',
  component: Layout,
  redirect: '/link/list',
  children: [{
    path: 'list',
    component: _import('link/list'),
    name: 'link-list',
    meta: {
      title: 'link',
      icon: 'wang',
      noCache: true
    }
  }]
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}

]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
]
