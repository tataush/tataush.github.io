<template>
    <div class="search-page">
        <h1 class="title">Поиск авиабилетов</h1>
        <search-form :authKey="auth_key" @finedOffers="getFinedOffers"/>
        <offers-list :offers="offers"/>
    </div>
</template>

<script>
import axios from 'axios'
import SearchForm from '@/components/SearchForm'
import OffersList from '@/components/OffersList'
export default {
  name: 'SearchPage',
  data () {
    return {
      api_key: '8e71ac9f18',
      auth_key: '',
      offers: null
    }
  },
  components: {
    SearchForm,
    OffersList
  },
  methods: {
    getFinedOffers (data) {
      this.offers = data
    }
  },
  mounted () {
    axios
      .get(`https://api-stage.etm-system.com/api/login/${this.api_key}`)
      .then(response => (this.auth_key = response.data.etm_auth_key))
  }
}
</script>
