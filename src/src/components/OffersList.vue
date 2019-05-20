<template>
  <div class="offer-list">
    <offer-item v-for="(offer, index) in avalableOffers" :offer="offer" :currency="offers.currency" :key="index"/>
  </div>
</template>

<script>
import OfferItem from '@/components/OfferItem'
export default {
  props: ['offers'],
  data () {
    return {
    }
  },
  computed: {
    avalableOffers () {
      if (this.offers) {
        return this.offers.offers
      }
    }
  },
  components: {
    OfferItem
  }
}
</script>

<style>
.offer-list {
  width: 1000px;
  margin: 0 auto;
}
</style>
