<template>
  <div class="login-form">
      <h1>hello, <span> {{ (name == '') ? 'Guest' : name }}</span></h1>
      <form action="">
            <input type="text" v-model="name" placeholder="enter you name">
            <button type="submit" v-on:click.prevent="show">Submit</button>
      </form>
  </div>
</template>

<script>
import me from '../components/me.vue'

export default {
    // layout: 'blog',
    head: {
        title: 'Login page'
    },
    data: function(){
        return {
            message: 'text',
            name: '',
            savedName: ''
        }
    },
    methods: {
        show: function(){
            if(this.name != '' ) {
                localStorage.setItem("name", this.name);
                alert( this.name + ', I save your name in local storage :)')    
            }
            this.savedName = localStorage.name;    
        }
    },
    components: {
        me: me
    }
}
</script>

<style>
    .login-form h1 {
        text-align: center;
    }

    .login-form  {
        padding-top: 100px;
    }

    .login-form h1 span {
        color: #999;
    }
    .login-form form {
        display: table;
        margin: 0 auto;
    }
    .login-form input {
        height: 40px;
        width: 200px;
        padding: 0 15px;
        color: #000;
        font-size: 16px;
        float: left;
        margin-right: 10px;
        border: 1px solid #999;
    }
    .login-form input:focus {
        outline:1px solid #000;
    }

    .login-form button {
        height: 40px;
        padding: 0 15px;
        border-radius: 0;
        background: #000;
        color: #fff;
        border: 0;
        font-size: 14px;
        cursor: pointer;
    }
</style>

