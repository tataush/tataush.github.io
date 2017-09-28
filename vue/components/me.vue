<template>
   <div class="me" style="backgrond:#fff;">
       <h1>hello {{ (name == '') ? 'enter yor name' : name }}</h1>
       <input type="text" v-model="name">
   </div>
</template>

<script>
    export default {
        data: function() {
            return {
                name: ''
            }   
        }
    }
</script>