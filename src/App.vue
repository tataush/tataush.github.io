<template>
  <div id="app" class="container">
    <h1>Product List</h1>
    <products-list :products="products" :error="error"/>
    <b-button @click="showModal"  variant="success">Create a Product</b-button>
    <b-modal ref="new-product-modal" hide-footer size="lg" title="Create a product">
      <div>
        <CreateProduct :availableProducts="products" @hodeModal="hodeModal"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ProductsList from '@/components/ProductsList.vue'
import CreateProduct from '@/components/CreateProduct.vue'
import axios from 'axios'
export default {
  name: 'app',
  data() {
    return {
      products: [],
      error: {},
      seenModal: false
    }
  },
  components: {
    ProductsList,
    CreateProduct
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    showModal() {
      this.$refs['new-product-modal'].show()
    },
    hodeModal() {
      this.$refs['new-product-modal'].hide()
    },
    getProducts() {
      axios.get('https://raw.githubusercontent.com/makedonmax/test_data/master/data.txt').then(response => {
        this.products = response.data
      }).catch(error => {
        this.error = error
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 20px auto;
}
</style>
