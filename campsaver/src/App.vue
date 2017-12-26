<template>
  <div id="app">
    <header-view/>
    <div class="container">
      <sidebar/>
      <div class="account-page">
        <router-view/>
      </div>
    </div>
    
  </div>
</template>

<script>
import HeaderView from '@/components/Header/Header'
import Sidebar from '@/components/MyAccount/Sidebar/Sidebar'
export default {
  name: 'app',
  components: {
    HeaderView,
    Sidebar
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.account-page {
  padding-left: 20px;
  padding-left: 260px;
}
h1 {
  display: block;
  font: normal 18px/21px Arial, sans-serif;
  color: #222;
  border-bottom: none;
  background-color: #efefef;
  padding: 15px 10px;
  border-radius: 3px;
  margin: 0 0 10px 0;
}
</style>
