<template>
    <div>
        <div class="add-new-product">
          <h3>Додати товар</h3>
          <div class="add-new-product-form">
            <div>
                <label for="name">Назва товару</label>
                <input id="name" v-model="newProduct.name" placeholder="Назва">
            </div>
            <div>
                <label>Кіл-ть</label>
                <input type="number" v-model="newProduct.qty" placeholder="Кількість">
            </div>
            <div>
                <label>Ціна закупки</label>
                <input type="number" v-model="newProduct.buyPrice" placeholder="Ціна закупки">
            </div>
            <div>
                <label>Ціна продажу</label>
                <input type="number" v-model="newProduct.sellPrice" placeholder="Ціна продажу">
            </div>
            <button @click="addProduct" class="btn">Додати</button>
          </div>
        </div>

        <h3>Список товарів ({{ products.length }})</h3>
    
        <div>
            <input v-model="productSearch" placeholder="Пошук" class="search-product">
        </div>
    
        <table>
          <thead>
            <tr>
              <th>Назва</th>
              <th>Кіл-ть</th>
              <th>Ціна закупка</th>
              <th>Націнка</th>
              <th>Ціна продажу</th>
              <th style="width: 190px; text-align: right;"></th>
            </tr>
          </thead>
          <tbody v-if="filteredProducts.length">
            <tr :class="[{'is-finished': p.qty === 0 }]" v-for="(p, index) in filteredProducts" :key="index">
                <td v-if="editingId !== p.id">{{ p.name }}</td>
                <td v-else><input v-model="editProduct.name"></td>

                <td v-if="editingId !== p.id">{{ p.qty || 0 }}</td>
                <td v-else><input type="number" v-model="editProduct.qty"></td>

                <td v-if="editingId !== p.id">{{ p.buyPrice.toFixed(2)}}</td>
                <td v-else><input type="number" v-model="editProduct.buyPrice"></td>
                <td>{{ calcMarkup(p) ?  calcMarkup(p).toFixed(2) : calcMarkup(p)}}%</td>
                <td v-if="editingId !== p.id">{{ p.sellPrice?.toFixed(2) }}</td>
                <td v-else><input type="number" v-model="editProduct.sellPrice"></td>

                <td>
                  <button v-if="editingId !== p.id" @click="startEdit(p)" class="btn">✏️ Редагувати</button>
                  <button v-else @click="saveEdit" class="btn">💾 Зберігти</button>
                </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
                <td colspan="6">Товар не знайдено :(</td>
            </tr>
          </tbody>
        </table>
        <div class="prices-and-estimates">
            <p>Сума закупівлі: <b>{{ productsStats.totalBuy?.toFixed(2) }}</b></p>
            <p>Сума продажу: <b>{{ productsStats.totalSell?.toFixed(2) }}</b></p>
            <p>Очікуваний прибуток: <b>{{ productsStats.profit?.toFixed(2) }}</b></p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue"
import { db } from "@/firebase"
import { collection, addDoc, getDocs, updateDoc, doc, onSnapshot } from "firebase/firestore"

const products = ref([])
const productSearch = ref("")
const editProduct = reactive({ name: "", qty: 0, buyPrice: 0, sellPrice: 0 })
const editingId = ref(null)

const productsCollection = collection(db, "products")

// 🔥 Реактивная подписка вместо getDocs
onMounted(() => {
  onSnapshot(productsCollection, snapshot => {
    products.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})


const filteredProducts = computed(() =>
  products.value.filter(p => p.name?.toLowerCase().includes(productSearch.value?.toLowerCase()))
)

// computed статистика по всем товарам
const productsStats = computed(() => {
  const totalBuy = products.value.reduce((sum, p) => sum + (p.buyPrice * p.qty), 0)
  const totalSell = products.value.reduce((sum, p) => sum + (p.sellPrice * p.qty), 0)
  const profit = totalSell - totalBuy
  return { totalBuy, totalSell, profit }
})

function calcMarkup(product) {
  if (!product.buyPrice || product.buyPrice <= 0) return 0
  return ((product.sellPrice - product.buyPrice) / product.buyPrice) * 100
}

const newProduct = reactive({
  name: "",
  qty: 0,
  buyPrice: 0,
  sellPrice: 0,
})

const startEdit = (product) => {
  editingId.value = product.id
  Object.assign(editProduct, product)
}

const saveEdit = async () => {
  const product = products.value.find(p => p.id === editingId.value)

  if (!product?.id) {
    console.error("❌ Нет id у продукта, не могу обновить:", product)
    return
  }
  const productRef = doc(db, "products", product.id)
  
  await updateDoc(productRef, { 
    name: editProduct.name,
    qty: Number(editProduct.qty),
    buyPrice: Number(editProduct.buyPrice),
    sellPrice: Number(editProduct.sellPrice)
  })

  // перезагружаем список из Firestore
  const snapshot = await getDocs(productsCollection)
  products.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  editingId.value = null
}

const addProduct = async () => {
  if (!newProduct.name) return

  await addDoc(productsCollection, {
    name: newProduct.name,
    qty: Number(newProduct.qty),
    buyPrice: Number(newProduct.buyPrice),
    sellPrice: Number(newProduct.sellPrice),
  })

  // 🔄 После добавления перегружаем список из Firestore
  const snapshot = await getDocs(productsCollection)
  products.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  // очистка формы
  newProduct.name = ""
  newProduct.qty = 0
  newProduct.buyPrice = 0
  newProduct.sellPrice = 0
}
</script>

<style>
.add-new-product {
    border: 1px solid #2c3e19;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
}

.add-new-product h3 {
    margin: 0;
    margin-bottom: 15px;
}

.add-new-product-form {
    display: flex;
    gap: 8px;
    align-items: flex-end;
}

.add-new-product-form label {
    display: block;
    font-size: 14px;
}
.add-new-product-form input {
    width: 100px;
}

.add-new-product-form div:first-child input {
    width: 300px;
}
</style>