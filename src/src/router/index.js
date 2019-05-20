import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Matrix from '@/components/Matrix'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/matrix',
      name: 'Main',
      component: Matrix
    }
  ]
})
