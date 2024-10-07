// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import YourComponent from '../components/YourComponent.vue' // 替换为您的组件路径

const routes = [
  {
    path: '/',
    name: 'Home',
    component: YourComponent // 替换为您的组件
  },
  {
    path: '/new-page',
    name: 'NewPage',
    component: () => import('../components/MedicalReportUpload.vue') // 替换为您的新页面组件
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router