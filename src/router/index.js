import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import HistoryPage from '../views/HistoryPage.vue'
import Products from '../views/ProductsPage.vue'
import WriteOffs from '../views/WriteOffs.vue'
import SecondHand from '@/views/SecondHandPage.vue'
import SecondHandCost from '@/views/SecondHandСost.vue'
import DebtsPage from '@/views/DebtsPage.vue'
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
  {
    path: '/write-offs',
    name: 'WriteOffs',
    component: WriteOffs,
  },
  {
    path: '/second',
    name: 'SecondHand',
    component: SecondHand,
  },
  {
    path: '/second/cost',
    name: 'SecondHandCost',
    component: SecondHandCost,
  },
  {
    path: '/debts',
    name: 'DebtsPage',
    component: DebtsPage,
  },
]

const router = createRouter({
  history: createWebHistory(), // режим history (чистые URL)
  routes,
})

export default router