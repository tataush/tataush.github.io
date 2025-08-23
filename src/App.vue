<template>
  <div class="layout">
    <HeaderComponent></HeaderComponent>
    <div class="page-body">
      <router-view />
    </div>
    <div>Гарних продажів :)</div>
  </div>
</template>

<script setup>
import HeaderComponent from './components/HeaderComponent.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html {
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
}


.layout {
  max-width: 1200px;
  min-height: 100vh;
  min-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 15px;
}

.page-body {
   flex: 1;
   padding: 20px 0;
}

table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
th { background: #f0f0f0; }

tr:hover {
  background: rgba(44, 62, 25, 0.16)
}

tr.is-finished {
  background: #f7e6ca
}

.pointer {
  cursor: pointer;
}

.default-blur {
  cursor: pointer;
  filter: blur(5px);
  transition: all 0.3s;
}

.default-blur:hover {
  filter: blur(0px);
}

input {
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0 10px;
  height: 36px;
  box-sizing: border-box;
}

select {
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0 10px;
  height: 32px;
}

.input:focus, .input:active {
    border: 2px solid #06402B;
    outline: none;
}

.btn {
    padding: 0 22px;
    border: 1px solid #06402B;
    border-radius: 6px;
    background-color: #06402B;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    height: 36px;;
}

.cart-actions {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0 0 0;
}

.btn.btn-red {
  background-color: #C21807;
  border: 1px solid #C21807;
}

.text-capitalize {
  text-transform: capitalize;
}

.section-header {
  display: flex;
  justify-content: space-between;
}

.filters label {
  display: block;
  font-size: 14px;
}

</style>
