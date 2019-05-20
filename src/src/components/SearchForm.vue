<template>
  <div>
    <form @submit.prevent="searchTickets">
      <div class="search_from">
        <div class="search_input">
          <label>Откуда</label>
          <input type="text" class="input_fild" v-model="ticketFrom" required>
        </div>
        <div class="search_input">
          <label>Куда</label>
          <input type="text" class="input_fild" v-model="ticketTo" required>
        </div>
        <div class="search_input">
          <label>Класс</label>
          <select class="select_class" v-model="ticketClass">
            <option value="E">Эконом</option>
            <option value="W">Премиум Эконом</option>
            <option value="B">Бизнес</option>
            <option value="F">Первый</option>
          </select>
        </div>
        <div class="search_input datepicker">
          <label>Дата отправления</label>
          <datepicker
            id="datepicker"
            format="yyyy-MM-dd"
            :disabledDates="disabledDates"
            required="required"
            v-model="time"
            >
          </datepicker>
        </div>
        <div class="search_button">
          <button class="btn" type="submit" :disabled="loadingResults">Поиск</button>
        </div>
      </div>
    </form>
    <div class="loading" v-if="loadingResults">
      <img src="../assets/loading.svg" alt="">
    </div>
    <div class="empty" v-if="isEmpty">
        <h4>Рейсы по Вашему запросу не найдены</h4>
    </div>
    <div class="error" v-if="error">
        {{error}}
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Datepicker from 'vuejs-datepicker'
export default {
  props: ['authKey'],
  data () {
    return {
      time: new Date(),
      yesterday: '',
      ticketFrom: '',
      ticketTo: '',
      request_id: '',
      ticketClass: 'E',
      isEmpty: false,
      disabledDates: {
        to: new Date()
      },
      loadingResults: false,
      error: ''
    }
  },
  methods: {
    searchTickets () {
      this.$emit('finedOffers', null)
      this.isEmpty = false
      this.loadingResults = true
      let selectedDate = document.querySelector('#datepicker').value
      let requesBody = {
        directions: [
          {
            departure_code: this.ticketFrom.toUpperCase(),
            arrival_code: this.ticketTo.toUpperCase(),
            date: selectedDate
          }
        ],
        adult_qnt: 1,
        class: this.ticketClass,
        fare_types: [
          'PUB',
          'NEG'
        ]
      }
      let requesHeader = {
        'etm-auth-key': this.authKey
      }
      axios.post('https://api-stage.etm-system.com/api/air/search', requesBody, {headers: requesHeader})
        .then(response => {
          this.request_id = response.data.request_id
          this.getAvailableOffers(this.request_id)
        })
        .catch(error => {
          this.error = error
          this.loadingResults = false
        })
    },
    getAvailableOffers (id) {
      let requesHeader = {
        'etm-auth-key': this.authKey
      }
      axios.get(`https://api-stage.etm-system.com/api/air/offers?request_id=${id}`, {headers: requesHeader})
        .then(response => {
          if (response.data.status === 'InProcess') {
            setTimeout(() => { this.getAvailableOffers(this.request_id) }, 500)
          } else if (response.data.status === 'Ready') {
            this.$emit('finedOffers', response.data)
            this.loadingResults = false
          } else {
            this.loadingResults = false
            this.isEmpty = true
          }
        })
        .catch(error => {
          this.error = error
          this.loadingResults = false
        })
    },
    getDisabledDate () {
      let today = new Date()
      let yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      this.disabledDates.to = yesterday
    }
  },
  mounted () {
    this.getDisabledDate()
  },
  components: {
    Datepicker
  }
}
</script>

<style>
.search_from {
  width: 800px;
  display: flex;
  margin: 20px auto;
}

.input_fild {
  width: 100%;
}
.search_input,
.search_button {
  width: 20%;
  margin: 0 5px;
}
.search_input label {
  font-size: 14px;
}
.select_class,
.datepicker input,
.input_fild {
  box-sizing: border-box;
  font-size: 16px;
  color: #333;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #333;
  border-radius: 4px;
  text-transform: uppercase;
  background: #fff;
  width: 100%;
}

.select_class {
  text-transform: none;
}
.datepicker input:focus,
.input_fild:focus {
  border-color: #3eaf7c;
}

.btn {
  height: 40px;
  background: #3eaf7c;
  border: 1px solid #3eaf7c;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  border-radius: 4px;
  margin-top: 22px;
}

.btn:hover {
  background: #379e70;
}

.btn:disabled {
  background: #bbb;
  border-color: #bbb;
}
select,
input:focus,
button:focus {
  outline: none;
}

.error,
.loading,
.empty {
  text-align: center;
}
</style>
