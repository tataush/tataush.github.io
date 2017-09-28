
<template>
  <div>
      <button @click="show">get</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
     data: function() {
        return { 
            title: {},
            id: 2
        }
    },
    methods: {
       show: function() {
            axios.get('http://jsonplaceholder.typicode.com/users/').then(function(response){
                console.log(response.data)
            }, function(){
                
            })
       }
    }
}
</script>
