import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'VueHome',
    component: () => import('../views/Home.vue'),
    meta: { title: 'Vue 首页' },
  },
  {
    path: '/about',
    name: 'VueAbout',
    component: () => import('../views/About.vue'),
    meta: { title: 'Vue 关于' },
  },
  {
    path: '/counter',
    name: 'VueCounter',
    component: () => import('../components/Counter.vue'),
    meta: { title: 'Vue 计数器' },
  },
  {
    path: '/users',
    name: 'VueUserList',
    component: () => import('../components/UserList.vue'),
    meta: { title: 'Vue 用户列表' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
