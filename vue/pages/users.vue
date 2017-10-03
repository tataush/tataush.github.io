<template>
	<div class="container">
		<ul>
			<li v-for="user in users"> {{ users }} </li>
		</ul>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	data () {
		return {
			users: []
		}
	},
	created() {
		    axios.get('/users.json').then(response => {
		   	this.users = response.data;
		   	console.log(this.users)
		}, function(e){
			console.log('error');
		});
	}
}
</script>