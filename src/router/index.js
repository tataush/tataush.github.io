import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import HistoryPage from '../views/HistoryPage.vue'
import Products from '../views/ProductsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
  },
  {
    path: '/history',
    name: 'HistoryPage',
    component: HistoryPage,
  },
]

const router = createRouter({
  history: createWebHistory(), // режим history (чистые URL)
  routes,
})

export default router