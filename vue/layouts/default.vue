<template>
<div class="wrapper" >
    <header class="main-header">
        <div class="container clearfix">
            <ul class="nav">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/login">Login</router-link></li>
                 <li><router-link to="/users">Users</router-link></li>
            </ul>
        </div>
        
    </header>
  <div class="main-container">
      <transition name="fade" mode="out-in">
      <router-view></router-view>
      </transition>
  </div>
</div>
</template>
<script>
    export default {
        head: {
            title: 'Домашнаяя страница',
        }
    }
</script>