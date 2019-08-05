<template>
	<div class="products">
    <b-row>
      <b-col>
        <div class="filter-products">
          <b-form-group>
            <b-form-input v-model="searchProduct" type="text" placeholder="Enter name or SKU"></b-form-input>
          </b-form-group>
          <div class="product-list">
            <div class="product-item" v-for="(item, index) in filteredProducts" @click="selectedProduct(item)" :key="index">{{item.name}} ({{item.sku}})</div>
          </div>
        </div>
      </b-col>
      <b-col>
        <div class="filter-products">
          <b-form-group>
            <b-form-input v-model="searchInSelected" type="text" placeholder="Enter name or SKU"></b-form-input>
          </b-form-group>
          <div class="product-list">
            <div class="product-item" v-for="(item, index) in filteredSelectetProducts" @click="removeProduct(item)" :key="index">{{item.name}} ({{item.sku}})</div>
          </div>
        </div>
      </b-col>
    </b-row>
	</div>
</template>

<script>
  export default {
    props: {
      products: {
        type: Array
      },
      includesType: {
        type: String
      }
    },
    data() {
      return {
        searchProduct: '',
        searchInSelected: '',
        selectedProducts: []
      }
    },
    methods: {
      selectedProduct(item) {
        this.selectedProducts.push(item);
        this.$emit('removeSelected', {
          list: this.selectedProducts,
          type: this.includesType
        })
      },
      removeProduct(removedItem) {
        this.selectedProducts.forEach((item, index) => {
          if (removedItem === item) {
            this.selectedProducts.splice(index, 1);
          }
        });
        // this.$emit('removeSelected', this.selectedProducts)
        this.$emit('removeSelected', {
          list: this.selectedProducts,
          type: this.includesType
        })
      }
    },
    computed: {
      filteredProducts: function() {
        return this.products.filter((item) => {
          return item.name.toLowerCase().indexOf(this.searchProduct.toLowerCase()) !== -1 || item.sku.toLowerCase().indexOf(this.searchProduct.toLowerCase()) !== -1
        })
      },
      filteredSelectetProducts: function() {
        return this.selectedProducts.filter((item) => {
          return item.name.toLowerCase().indexOf(this.searchInSelected.toLowerCase()) !== -1 || item.sku.toLowerCase().indexOf(this.searchInSelected.toLowerCase()) !== -1
        })
      }
    }
  }
</script>

<style scoped>
.includes-products {
  margin-bottom: 10px;
}
.form-group {
  margin-bottom: 5px;
  font-size: 14px;
}
.product-list {
  height: 200px;
  overflow: auto;
  border: 1px solid #ccc;
}
.product-item {
  font-size: 12px;
  padding: 5px 5px;
}

.product-item:hover {
  cursor: pointer;
  background: #ccc;
}

</style>