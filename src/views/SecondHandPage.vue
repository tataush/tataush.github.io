<template>
    <div>
        <div class="second-hand-header">
            <h2>Second Hand</h2>
            <router-link to="/second/cost">Закупівля</router-link>
        </div>
        <div class="new-sale-btn">
          <button @click="startSale" :class="['btn', {'hide-me': showSaleForm}]">+ Новий продаж</button>
        </div>
        <div class="new-sale-form" v-if="showSaleForm">
            <div class="new-sale-form-row">
                <div class="new-sale-form-item">
                    <label>Назва</label>
                    <input type="text" placeholder="Назва: блузка" v-model="itemName">
                </div>
                <div class="new-sale-form-item">
                    <label>Ціна</label>
                    <input type="number" placeholder="Ціна: 100" v-model="itemPrice">
                </div>
                <div class="new-sale-form-item">
                    <button @click="addToCart" class="btn">+ Додати</button>
                </div>
            </div>
            <div class="new-sale-cart" v-if="cart?.length">
                <h3>Кошик</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Товар</th>
                            <th>Ціна</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(s, i) in cart" :key="i">
                            <td class="text-capitalize">{{ s.name }}</td>
                            <td style="width: 150px;">{{ s.price?.toFixed(2) }}</td>
                            <td><span class="remove" @click="removeItem(s)">✖</span></td>
                        </tr>
                    </tbody>
                </table>
                <div style="text-align: right; padding: 15px 0;">
                    Сума: <b>{{cartTotal}}</b>
                </div>
                <div style="text-align: right;">
                    <button @click="checkout" class="btn">Оформити покупку</button>
                </div>
            </div>
        </div>

        <div>
            <h3>Продажі за сьогодні ({{ todaySecondHandSales?.length }})</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width: 200px;">Дата, час</th>
                        <th>Товар</th>
                        <th>Ціна</th>
                    </tr>
                </thead>
                <tbody v-if="todaySecondHandSales?.length">
                    <tr v-for="(s, i) in todaySecondHandSales" :key="i">
                        <td style="width: 300px;">{{ new Date(s.date.seconds * 1000).toLocaleString() }}</td>
                        <td class="text-capitalize">{{ s.name }}</td>
                        <td>{{ s.price?.toFixed(2) }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="5">
                            <div class="no-sales">Сьогодні ще немає продажів. <br> <b>Вдалого дня!</b></div>
                        </td>
                    </tr>
                </tbody>
          </table>
        </div>
         <div class="second-stats-container">
            <div class="stats total">Каса: <b>{{ productsStats.toFixed(2) }}грн</b></div>
        </div>

        <div>
            <div class="section-header">
                <h3>Всі Продажі ({{ secondHand?.length }})</h3>
                <div class="filters">
                    <div >
                        <label>Дата</label>
                        <input type="date" v-model="filterDate" @change="applyFilters"/>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 200px;">Дата, час</th>
                        <th>Товар</th>
                        <th>Ціна</th>
                    </tr>
                </thead>
                <tbody v-if="secondHand?.length">
                    <tr v-for="(s, i) in secondHand" :key="i">
                        <td style="width: 300px;">{{ new Date(s.date.seconds * 1000).toLocaleString() }}</td>
                        <td class="text-capitalize">{{ s.name }}</td>
                        <td>{{ s.price?.toFixed(2) }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="5">
                            <div class="no-sales">Сьогодні ще немає продажів. <br> <b>Вдалого дня!</b></div>
                        </td>
                    </tr>
                </tbody>
          </table>
        </div>
        <div class="second-stats-container">
            <div class="stats total">Сума: <b>{{ allProductsStats.toFixed(2) }}грн</b></div>
        </div>
    </div>
</template>

<script setup>
import { collection, onSnapshot, serverTimestamp, addDoc, query, orderBy, where } from "firebase/firestore"
import { db } from "@/firebase"
import { ref, onMounted, computed } from "vue"
import { useToast } from "vue-toastification"

const toast = useToast()
const secondHand = ref([])
const todaySecondHandSales = ref([])
const secondHandCollection = collection(db, "second")
const showSaleForm = ref(false)
const cart = ref([])
const itemName = ref('')
const itemPrice = ref('')
const filterDate = ref('')


// 🔥 Реактивная подписка вместо getDocs
onMounted(() => {
  const qry = query(secondHandCollection, orderBy("date", "desc"))
  onSnapshot(qry, snapshot => {
    secondHand.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })

    // начало и конец сегодняшнего дня
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const q = query(
    secondHandCollection,
    where("date", ">=", start),
    where("date", "<=", end),
    orderBy("date", "desc")
  )

  onSnapshot(q, snapshot => {
    todaySecondHandSales.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })

})

function applyFilters() {
    // допустим, у тебя есть дата, например 2025-08-23
    let qry = query(secondHandCollection, orderBy("date", "desc"))
    if (filterDate.value) {
        const selectedDate = new Date(filterDate.value)

        // начало и конец дня
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        qry = query(
            secondHandCollection,
            where("date", ">=", startOfDay),
            where("date", "<=", endOfDay),
            orderBy("date", "desc")
        )
    }
    
    onSnapshot(qry, snapshot => {
        secondHand.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
}


const cartTotal = computed(() => {
    let total = 0;
    cart.value.forEach(item => {
        total += Number(item.price)
    })
    return total.toFixed(2)
})

const productsStats = computed(() => {
  const totalSell = todaySecondHandSales.value.reduce((sum, p) => sum + (p.price), 0)
  return totalSell
})

const allProductsStats = computed(() => {
  const totalSell = secondHand.value.reduce((sum, p) => sum + (p.price), 0)
  return totalSell
})


const removeItem = (item) => {
  cart.value = cart.value.filter((c) => c !== item);
};

function startSale() {
    showSaleForm.value = true
}

function addToCart() {
    if (!itemName.value) {
        toast.error('Вкажіть назва товару')
        return;
    }
    if (!itemPrice.value) {
        toast.error('Вкажіть вартіст товару')
        return;
    }

    cart.value.push({
        name: itemName.value,
        price: Number(itemPrice.value)
    })

    itemName.value = '';
    itemPrice.value = null;
    
}

function checkout() {
    console.log('checkout')

    try {
        cart.value.forEach( async (item) => {
         // добавляем продажу
            await addDoc(collection(db, "second"), {
                name: item.name,
                price: item.price,
                date: serverTimestamp(),
            });
        });
        
        cart.value = []
        showSaleForm.value = false
        toast.success("🚀 Чудова робота!")
    } catch {
        toast.error('Виникла помилка')
    }
}
</script>

<style>
.new-sale-btn {
    display: flex;
    justify-content: flex-end;
}

.new-sale-form {
    border: 1px solid #2c3e19;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    width: 585px;
}

.new-sale-form-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
}

.new-sale-form-item label {
    font-size: 14px;
    display: block;
}

.new-sale-form-item input {
    width: 100%;
    box-sizing: border-box;
}

.new-sale-form-item:first-child {
    width: 280px;
}

.second-stats-container {
    padding: 20px 0;
}

.second-hand-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 15px 0;
}

.second-hand-header a {
    text-decoration: none;
    color: #06402B;
    font-weight: 600;
}
</style>