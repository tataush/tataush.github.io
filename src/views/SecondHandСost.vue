<template>
    <div>
        <div class="new-sale-btn">
          <button @click="startSale" :class="['btn', {'hide-me': showSaleForm}]">+ Додати закупівлю</button>
        </div>
        <div class="new-sale-form" v-if="showSaleForm">
            <div class="new-sale-form-row">
                <div class="new-sale-form-item">
                    <label>Назва</label>
                    <input type="text" placeholder="Назва: інтернет замовлення" v-model="itemName">
                </div>
                <div class="new-sale-form-item">
                    <label>Ціна</label>
                    <input type="number" placeholder="Ціна: 1000" v-model="itemPrice">
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
                    <button @click="checkout" class="btn">Зберігти</button>
                </div>
            </div>
        </div>

        <div>
            <h3>Список закупівель</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width: 200px;">Дата, час</th>
                        <th>Назва</th>
                        <th>Ціна</th>
                    </tr>
                </thead>
                <tbody v-if="secondHand?.length">
                    <tr v-for="(s, i) in secondHand" :key="i">
                        <td style="width: 300px;">{{ new Date(s.date * 1000).toLocaleString() }}</td>
                        <td class="text-capitalize">{{ s.name }}</td>
                        <td>{{ s.price?.toFixed(2) }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="5">
                            <div class="no-sales">Витра нема.</div>
                        </td>
                    </tr>
                </tbody>
          </table>
        </div>
        <div class="second-stats-container">
            <div class="stats total">Сума: <b>{{ productsStats.toFixed(2) }}грн</b></div>
        </div>
    </div>
</template>

<script setup>
import { collection, onSnapshot, serverTimestamp, addDoc, query, orderBy } from "firebase/firestore"
import { db } from "@/firebase"
import { ref, onMounted, computed } from "vue"
import { useToast } from "vue-toastification"

const toast = useToast()
const secondHand = ref([])
const secondCostCollection = collection(db, "secondCost")
const showSaleForm = ref(false)
const cart = ref([])
const itemName = ref('')
const itemPrice = ref('')



// 🔥 Реактивная подписка вместо getDocs
onMounted(() => {
  const qry = query(secondCostCollection, orderBy("date", "desc"))
  onSnapshot(qry, snapshot => {
    secondHand.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})


const cartTotal = computed(() => {
    let total = 0;
    cart.value.forEach(item => {
        total += Number(item.price)
    })
    return total.toFixed(2)
})

const productsStats = computed(() => {
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
    try {
        cart.value.forEach( async (item) => {
         // добавляем продажу
            await addDoc(collection(db, "secondCost"), {
                name: item.name,
                price: item.price,
                date: serverTimestamp(),
            });
        });
        
        cart.value = []
        showSaleForm.value = false
        toast.success("Додано")
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
</style>