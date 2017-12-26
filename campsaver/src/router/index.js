import Vue from 'vue'
import Router from 'vue-router'
import AboutMe from '@/components/MyAccount/AboutMe/AboutMe'
import AccountSettings from '@/components/MyAccount/AccountSettings/AccountSettings'
import Error from '@/components/Error'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AccountSettings',
      component: AccountSettings
    },
    {
      path: '/about-me',
      name: 'AboutMe',
      component: AboutMe
    },
    {
      path: '/account-settings',
      name: 'AccountSettings',
      component: AccountSettings
    },
    {
      path: '*',
      name: 'Error',
      component: Error
    }
  ],
  history: 'true',
  mode: 'history'
})
