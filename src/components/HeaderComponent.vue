<template>
    <div class="main-header">
        <router-link to="/" class="logo">
            <img src="/logo.png" height="50px" width="50px" alt="logo">
            <span>Мʼята</span>
        </router-link>
        <div class="nav">
            <router-link to="/">Головна</router-link>
            <router-link to="/products">Товари</router-link>
            <router-link to="/history">Історія продажу</router-link> 
        </div>
    </div>
</template>

<style>
.main-header {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.main-header .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 28px;
    font-weight: 600;
    color: #2c3e19;
    text-decoration: none;
}

.main-header .nav {
    display: flex;
    gap: 22px;
    
}

.main-header .nav a {
    text-decoration: none;
    color: #1f212b;
    font-size: 18px;
    font-weight: 400;
    position: relative;
}

.main-header .nav a.router-link-exact-active::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    border-radius: 2px;
    background: #06402B;
}
</style>