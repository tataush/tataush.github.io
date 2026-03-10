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
    
        <div style="display: flex; justify-content: space-between;">
            <input v-model="productSearch" placeholder="Пошук: назва або ціна" class="search-product">
            <button @click="showZeroProducts = !showZeroProducts" class="btn">
              {{ showZeroProducts ? "Сховати нульові" : "Показати всі" }}
            </button>
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
                <td v-if="editingId !== p.id" class="text-capitalize">{{ p.name }}</td>
                <td v-else><input v-model="editProduct.name"></td>

                <td v-if="editingId !== p.id">{{ p.qty || 0 }}</td>
                <td v-else><input type="number" v-model="editProduct.qty"></td>

                <td v-if="editingId !== p.id">{{ p.buyPrice.toFixed(2)}}</td>
                <td v-else><input type="number" v-model="editProduct.buyPrice"></td>
                <td>{{ calcMarkup(p) ?  calcMarkup(p).toFixed(2) : calcMarkup(p)}}%</td>
                <td v-if="editingId !== p.id">{{ p.sellPrice?.toFixed(2) }}</td>
                <td v-else><input type="number" v-model="editProduct.sellPrice"></td>

                <td>
                  <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button v-if="editingId !== p.id" @click="startEdit(p)" class="btn">✏️</button>
                    <button v-else @click="saveEdit" class="btn">💾</button>
                    <button @click="openWriteOff(p)" class="btn">✂️</button>
                    <button @click="deleteProduct(p)" class="btn">🗑️</button>
                  </div>
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

    <!-- Модалка -->
        <div v-if="showWriteOff" class="modal-overlay">
            <div class="modal">
                <h2>Списання товару</h2>
                <h2 class="text-capitalize">{{ selectedProduct.name}}</h2>
                <div class="write-off-form">
                    <div class="write-off-form-item">
                        <label>Кількість:</label>
                        <input type="number" v-model="writeOffQty" min="1" :max="selectedProduct?.qty" />
                    </div>

                    <div class="write-off-form-item">
                        <label>Причина:</label>
                        <select v-model="writeOffReason">
                            <option value="Брак">Брак</option>
                            <option value="Псування">Псування</option>
                            <option value="Подарунок">Подарунок</option>
                            <option value="Особисте використання">Особисте використання</option>
                            <option value="Кража">Кража</option>
                        </select>
                    </div>
                </div>

                <div class="modal-actions">
                    <button @click="confirmWriteOff" class="btn">Списати</button>
                    <button @click="closeWriteOff" class="btn">Відмінити</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue"
import { db } from "@/firebase"
import { collection, addDoc, getDocs, updateDoc, doc, onSnapshot } from "firebase/firestore"
import { useToast } from "vue-toastification"

const toast = useToast()
const products = ref([])
const productSearch = ref("")
const editProduct = reactive({ name: "", qty: 0, buyPrice: 0, sellPrice: 0 })
const editingId = ref(null)
const showWriteOff = ref(false)
const productsCollection = collection(db, "products")
const writeOffsCollection = collection(db, "writeOffs")
const writeOffQty = ref(1)
const selectedProduct = reactive({ name: "", qty: 0, buyPrice: 0, sellPrice: 0 })
const writeOffReason = ref('')
const showZeroProducts = ref(false)

// 🔥 Реактивная подписка вместо getDocs
onMounted(() => {
  onSnapshot(productsCollection, snapshot => {
    products.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})


const filteredProducts = computed(() => {
  const search = productSearch.value.toLowerCase().trim()

  return products.value
    .filter(p => showZeroProducts.value || p.qty > 0)
    .filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(search)
      const priceMatch = String(p.sellPrice ?? "") === search
      return nameMatch || priceMatch
    })
})

// computed статистика по всем товарам
  const productsStats = computed(() => {
  const totalBuy = products.value.reduce((sum, p) => sum + (p.buyPrice * p.qty), 0)
  const totalSell = products.value.reduce((sum, p) => sum + (p.sellPrice * p.qty), 0)
  const profit = totalSell - totalBuy
  return { totalBuy, totalSell, profit }
})

function openWriteOff(product) {
    showWriteOff.value = true
    Object.assign(selectedProduct, product)
}

function closeWriteOff() {
    showWriteOff.value = false
}

function confirmWriteOff() {
    writeOffProduct(selectedProduct, writeOffQty.value, writeOffReason.value)
}

function calcMarkup(product) {
  if (!product.buyPrice || product.buyPrice <= 0) return 0
  return ((product.sellPrice - product.buyPrice) / product.buyPrice) * 100
}

const newProduct = reactive({
  name: "",
  qty: null,
  buyPrice: null,
  sellPrice: null,
})

const startEdit = (product) => {
  editingId.value = product.id
  Object.assign(editProduct, product)
}

const saveEdit = async () => {
  try {
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
    toast.success("🚀 Товар змінено успешно!")
  } catch (e) {
    toast.error("Виникла помилка")
  }
}

const deleteProduct = async (product) => {
  if (!confirm(`Видалити товар "${product.name}" ?`)) return

  try {
    const productRef = doc(db, "products", product.id)

    await updateDoc(productRef, {
      qty: 0
    })

    toast.success("🗑️ Товар видалено")
  } catch (e) {
    console.error(e)
    toast.error("Помилка при видаленні")
  }
}

const addProduct = async () => {
  try {
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
    toast.success("🚀 Товар додано успешно!")
  } catch (e) {
    toast.error("Виникла помилка")
  }
}


async function writeOffProduct(product, qty, reason = "Не вказали") {
  if (qty <= 0) return

  try {
    // уменьшаем остаток
    const newQty = product.qty - qty
    if (newQty < 0) {
        toast.error("Не можна списати більше, ніж є на складі")
        return
    }

    // обновляем товар
    const productRef = doc(db, "products", product.id)
    await updateDoc(productRef, { qty: newQty })

    // сохраняем в историю списаний
    await addDoc(writeOffsCollection, {
        productId: product.id,
        name: product.name,
        qty,
        reason,
        date: new Date().toISOString()
    })

    showWriteOff.value = false
    writeOffQty.value = 1;

    // перезагружаем список из Firestore
    const snapshot = await getDocs(productsCollection)
    products.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    toast.success("Товар списано успешно!")
  } catch (e) {
    toast.error("Виникла помилка")
  }
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

/* затемнение фона */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* сама модалка */
.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 350px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal h2 {
  margin: 0 0 15px 0;
  font-size: 18px;
}

.modal label {
    display: block;
    font-size: 14px;
}

.modal input, .modal select {
    width: 100%;
    box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 15px;
}

.modal-actions button:first-child {
  background: #e74c3c;
  border-color: #e74c3c;
  color: white;
}


.write-off-form {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.write-off-form-item {
    width: 100%;
}
</style>