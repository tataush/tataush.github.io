<template>
<div class="create-product">
	<div class="create-product-from">
    <b-form @submit.prevent="createProduct">
      <b-row>
        <b-col>
          <b-form-group label="SKU">
            <b-form-input v-model="sku" type="text" placeholder="Enter SKU" required></b-form-input>
          </b-form-group>
          <b-form-group label="Name">
            <b-form-input v-model="name" type="text" placeholder="Enter name" required></b-form-input>
          </b-form-group>
          <b-form-group label="Type">
            <b-form-select v-model="selectedType" :options="type" required></b-form-select>
          </b-form-group>
          <b-form-group label="Customer type">
            <b-form-select v-model="selectedCustomerType" :options="customerType" required></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Valid value">
            <b-form-input v-model="validValue" type="number"  :disabled="selectedType === 'BASIC_SINGLE'" placeholder="Valid value" required></b-form-input>
          </b-form-group>
          <b-form-group label="Price">
            <b-form-input v-model="price" type="number" placeholder="Enter Price" required></b-form-input>
          </b-form-group>
          <b-form-group label="Allow recharge">
            <b-form-checkbox v-model="allowRecharge" type="checkbox" placeholder="Price"></b-form-checkbox>
          </b-form-group>
          <b-form-group label="Recharge price">
            <b-form-input v-model="rechargePrice" type="number" :disabled="!allowRecharge" placeholder="Recharge price" required></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <div>
        <div class="includes-products">
          <h6>Include type</h6>
          <Includes :products="filteredProducts" @selectProduct="filterProducts" @removeSelected="removeSelected" includes-type="Include"/>
        </div>
        <div class="includes-products">
          <h6>Pass type</h6>
          <Includes :products="filteredProducts" @selectProduct="filterProducts" @removeSelected="removeSelected" includes-type="Pass"/>
        </div>
      </div>
      <b-button type="submit" variant="primary">Create</b-button>
    </b-form>
  </div>
</div>
</template>
<script>
  import Includes from '@/components/Includes.vue'
	export default {
    props: {
      availableProducts: {
        type: Array
      }
    },
		data() {
			return {
          sku: '',
          name: '',
          type: ['BASIC_SINGLE', 'BASIC_VALID_HOURS', 'PASS_LIMITED', 'PASS_UNLIMITED'],
          selectedType: 'BASIC_SINGLE',
          customerType: ['ADULT', 'CHILD'],
          selectedCustomerType: 'ADULT',
          validValue: null,
          price: null,
          allowRecharge: false,
          rechargePrice: null,
          includes: [],
          filteredProducts: [],
          includesList: [],
          passList: [],
          selectedProductsInclude: [],
          selectedProductsPass: [],
          userSelected: []
			}
		},
    mounted() {
      this.allProducts();
    },
    methods: {
      allProducts() {
        this.filteredProducts = [...this.availableProducts];
      },
      createProduct() {
        let product = [{
          customerType: this.selectedCustomerType,
          name: this.name,
          validValue: parseFloat(this.validValue) || 0,
          price: parseFloat(this.price) || 0,
          sku: this.sku,
          type: this.selectedType,
          includes: this.includes,
        }];
        var FileSaver = require('file-saver');
        var blob = new Blob([JSON.stringify(product, null, 1)], {type: 'text/plain'});
        FileSaver.saveAs(blob, "new-product.txt");
        this.$emit('hodeModal');
      },
      filterProducts(data) {
        if (data.type == "Include") {
          this.includesList = []
          this.selectedProductsInclude = data.list;
          data.list.forEach((item) => {
            this.includesList.push({
              type: "INCLUDE",
              connectedProduct: {
                id: item.id 
              }
            })
          })
        } else {
          this.passList = [];
          this.selectedProductsPass = data.list;
          data.list.forEach((item) => {
            this.passList.push({
              type: "PASS",
              connectedProduct: {
                id: item.id 
              }
            })
          })
        }
        this.userSelected = this.selectedProductsInclude.concat(this.selectedProductsPass);
         this.userSelected.forEach((ListItem) => {
          this.filteredProducts.forEach((item, index) => {
            if (item == ListItem) {
              this.filteredProducts.splice(index, 1);
            }
          })
        });
        this.includes = this.passList.concat(this.includesList);
      },
      removeSelected(data) {
        this.filteredProducts = [...this.availableProducts];
        this.includesList.forEach((ListItem) => {
          data.list.forEach((item, index) => {
            if (item == ListItem) {
              this.includesList.splice(index, 1);
            }
          })
        });
        this.filterProducts(data);
      }
    },
    components: {
      Includes
    }
	}
</script>
<style scoped>
.form-group {
  margin-bottom: 5px;
  font-size: 14px;
}
.custom-select,
.form-control {
  font-size: 14px;
}
.custom-control {
  min-height: 35px;
}
.col-form-label {
  padding-bottom: 0;
}

.includes-products {
  padding: 5px;
  border: 1px solid #ccc;
  margin: 10px 0;
}
</style>