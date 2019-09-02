<template>
	<div class="products-list">
   <table v-if="products.length">
     <thead>
       <tr>
         <th>ID</th>
         <th>SKU</th>
         <th>Name</th>
         <th>Type</th>
         <th>Customer type</th>
         <th>Valid value</th>
         <th>Price</th>
         <th>Allow recharge</th>
         <th>Recharge price</th>
         <th>Vendor name</th>
       </tr>
     </thead>
     <tbody>
        <tr v-for="(item, index) in products" :key="index">
          <td>{{item.id}}</td>
          <td>{{item.sku}}</td>
          <td>{{item.name}}</td>
          <td>{{item.type}}</td>
          <td>{{item.customerType}}</td>
          <td>{{item.validValue}}</td>
          <td>{{item.price}}</td>
          <td>{{item.allowRecharge}}</td>
          <td>{{item.rechargePrice}}</td>
          <td>{{item.vendor.name}}</td>
        </tr>
     </tbody>
    </table>
    <div v-else>
      <p v-if="error.message">{{error.message}}</p>
      <p v-else>Product list is empty.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array
    },
    error: {}
  }
}
</script>

<style scoped>
table {
  border: 1px solid #ccc;
  width: 100%;
  border-spacing: 0;
  font-size: 14px;
  margin-bottom: 20px;
}
table th,
table td {
  text-align: left;
  padding: 5px;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
table tr:nth-child(even) td {
  background: #f3f3f3;
}
table tr:last-child td {
  border-bottom: 0;
}
table th:last-child,
table td:last-child {
  border-right: none; 
}
</style>