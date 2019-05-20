<template>
  <div class="offer_item">
    <div class="offer_header">
      <div class="carrier_logo">
        <img :src="offer.carrier_logo" :alt="offer.carrier_name">
        <span class="carrier_name">{{offer.carrier_name}}</span>
      </div>
      <div class="right_side">
        <div class="min_price">
          <span class="price">Цена от {{offer.min_price}} <span class="currency">{{currency}}</span></span>
        </div>
        <div class="show_more" :class="{active : showAll}" @click="showAll = !showAll"></div>
      </div>
    </div>
    <div class="all_offers" v-if="showAll">
      <div v-for="(item, index) in sortedItems" :key="index" class="offer_detale">
        <div>
          <span>Время в пути: {{item.duration_formated}}</span>
        </div>
        <div>
          <span v-if="item.stops === '0'">Без пересадок</span>
          <span v-else>Пересадок: {{item.stops}}</span>
        </div>
       <div>
          <span>Цена: {{item.price}} <span class="currency">{{currency}}</span></span>
       </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ['offer', 'currency'],
  data () {
    return {
      showAll: false
    }
  },
  computed: {
    segments () {
      return this.offer.offers[0].segments
    },
    sortedItems () {
      return this.offer.offers[0].segments.slice().sort(function (a, b) {
        return a.price + b.price
      })
    }
  }
}
</script>

<style>
.offer_item {
  border: 1px solid #bbb;
  margin-bottom: 15px;
  border-radius: 4px;
}

.offer_header {
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
}

.carrier_logo {
  width: 250px;
}
.carrier_logo img {
  max-width: 200px;
}
.carrier_name {
  display: block;
  font-weight: bold;
}

.right_side {
  display: flex;
}

.min_price {
  text-align: right;
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.price {
  display: block;
  color: #333;
}

.currency {
  color: #3eaf7c;
  font-weight: bold;
}

.show_more {
  width: 50px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.show_more:after {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  border-right: 2px solid #333;
  border-bottom: 2px solid #333;
  transform:rotate(45deg);
  margin-top: -5px;
}

.show_more.active:after {
  margin-top: 0px;
  transform:rotate(-135deg);
}
.show_more:hover:after {
  border-color: #3eaf7c;
}

.offer_detale {
  padding: 10px;
  border-top: 1px solid #bbb;
}
</style>
