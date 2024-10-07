import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 在这里定义您的路由
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')