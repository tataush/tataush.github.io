<template>
    <div class="homa-page">
        <div class="actions">
          <button @click="startSale" :class="[{'hide-me': showSaleForm}]">+ Дати в борг</button>
        </div>
        
        <!-- Форма продажи -->
        <div class="new-sale" v-if="showSaleForm" >
            <div class="new-salle-header">
                <h3>Борг</h3>
                <button class="btn btn-red" @click="closeSale">Відмінити</button>
            </div>
            <input v-model="saleSearch" placeholder="Пошук: назва або ціна" class="search-product">
            <table v-if="saleSearch">
                    <thead>
                        <tr>
                            <th>Назва</th>
                            <th>В наявності</th>
                            <th>Ціна</th>
                        </tr>
                    </thead>
                    <tbody v-if="filteredProducts?.length">
                        <tr class="pointer" v-for="p in filteredProducts" :key="p.id" @click="chooseProduct(p)">
                            <td class="text-capitalize">{{ p.name}}</td>
                            <td>{{ p.qty }}</td>
                            <td>{{ p.sellPrice?.toFixed(2) }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="3">
                                <div>Товар не знайдено :(</div>
                            </td>
                        </tr>
                    </tbody>
            </table>

            <div v-if="selectedProduct">  
                <p>Товар: <b>{{ selectedProduct.name }}</b></p>
                <p>Ціна продажу: {{ selectedProduct.sellPrice?.toFixed(2) }}</p>
                <input type="number" v-model="selectedQty" min="1">
                <p>Сума: <b>{{ (selectedProduct.sellPrice * selectedQty)?.toFixed(2) }}</b></p>
                <button @click="addToCart" class="btn">+ Додати в чек</button>
            </div>
        </div>

        <div class="new-sale" v-if="cart?.length">
            <div class="cart">
                <h3>🛒 Кошик</h3>
                <div class="debts-user-name">
                  <label>Іʼмя</label>
                  <input v-model="cusromer" placeholder="Хто бере в борг" class="search-product"/>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Товар</th>
                        <th>Кіл-ть</th>
                        <th>Ціна</th>
                        <th>Сума</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in cart" :key="i">
                            <td class="text-capitalize">{{ item.product.name }}</td>
                            <td>{{ item.qty }}</td>
                            <td>{{ item.product.sellPrice?.toFixed(2) }}</td>
                            <td>{{ item.qty * item.product.sellPrice ?.toFixed(2)}}</td>
                            <td><span class="remove" @click="removeFromCart(item)">✖</span></td>
                        </tr>
                    </tbody>
                </table>
                <div class="cart-actions">
                    Сума: <b> {{cartTotal.toFixed(2)}}грн</b>
                </div>
                <div class="cart-actions">
                    <button @click="checkout" class="btn">Оформити борг</button>
                </div>
            </div>
        </div>


        <div>
            <h3>Борги ({{ currentDebts?.length }})</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width: 200px;">Дата, час</th>
                        <th>Іʼмя</th>
                        <th>Товар</th>
                        <th>Кіл-ть</th>
                        <th>Ціна</th>
                        <th>Сума</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody v-if="currentDebts?.length">
                    <tr v-for="(s, i) in currentDebts" :key="i">
                        <td style="width: 200px;">{{ new Date(s.date.seconds * 1000).toLocaleString() }}</td>
                        <td class="text-capitalize" style="width: 200px;">{{ s.cusromer }}</td>
                        <td class="text-capitalize">{{ s.name }}</td>
                        <td>{{ s.qty }}</td>
                        <td>{{ s.price?.toFixed(2) }}</td>
                        <td>{{ s.sum?.toFixed(2)}}</td>
                        <td>
                          <div class="debts-actions">
                            <button class="btn" @click="handleReturnProcuct(s)">🔄</button>
                            <button class="btn" @click="handleCloseDebit(s)">💵</button>
                          </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="7">
                            <div class="no-sales">Боргів немає. <br> <b>Вдалого дня!</b></div>
                        </td>
                    </tr>
                </tbody>
          </table>
          <div class="stats-container" v-if="revenue">
            <div class="stats total">Борг: <b>{{ revenue?.toFixed(2) }}грн</b></div>
            </div>
        </div>

        <div>
            <h3>Історія Боргів ({{ debtsHistory?.length }})</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width: 200px;">Дата, час</th>
                        <th>Іʼмя</th>
                        <th>Товар</th>
                        <th>Кіл-ть</th>
                        <th>Ціна</th>
                        <th>Сума</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody v-if="debtsHistory?.length">
                    <tr v-for="(s, i) in debtsHistory" :key="i">
                        <td style="width: 200px;">{{ new Date(s.date.seconds * 1000).toLocaleString() }}</td>
                        <td class="text-capitalize" style="width: 200px;">{{ s.cusromer }}</td>
                        <td class="text-capitalize">{{ s.name }}</td>
                        <td>{{ s.qty }}</td>
                        <td>{{ s.price?.toFixed(2) }}</td>
                        <td>{{ s.sum?.toFixed(2)}}</td>
                        <td>
                          <span v-if="s.status === 'refund'">Повернули товар</span>
                          <span v-else-if="s.status === 'paid'">Оплатили</span>
                          <span v-else>{{ s.status }}</span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="7">
                            <div class="no-sales">Боргів немає.</div>
                        </td>
                    </tr>
                </tbody>
          </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  onSnapshot,
  query,
  getDoc
} from "firebase/firestore";

import { useToast } from "vue-toastification"

const toast = useToast()
// ---------------- ПРОДУКТЫ ----------------
const products = ref([]);
const debts = ref([]);
const showSaleForm = ref(false);
const saleSearch = ref("");
const saleQty = ref(1);
const selectedProduct = ref(null);
const selectedQty = ref(1);
const cart = ref([]);
const cusromer = ref('')

// загрузка данных
const loadProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  products.value = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// computed фильтр
const filteredProducts = computed(() => {
  const search = saleSearch.value.toLowerCase().trim()

  return products.value.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(search)
    const priceMatch = String(p.sellPrice ?? "").toLowerCase() === search

    return nameMatch || priceMatch
  })
})

const currentDebts = computed(() => {
  return debts.value.filter(d => d.status == 'new')
})


const debtsHistory = computed(() => {
  return debts.value.filter(d => d.status !== 'new')
})


const revenue = computed(() => {
  return currentDebts.value.reduce((acc, s) => acc + s.sum, 0);
})

// ---------------- ПРОДАЖИ ----------------
const startSale = () => {
  showSaleForm.value = true;
  saleSearch.value = "";
  saleQty.value = 1;
  selectedProduct.value = null;
};

const closeSale = () => {
  showSaleForm.value = false;
  saleSearch.value = "";
  saleQty.value = 1;
  selectedProduct.value = null;
  cart.value = [];
};

const chooseProduct = (p) => {
  selectedProduct.value = p;
  saleSearch.value = p.name;
};

// корзина
const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => {
    return sum + Number(item.product.sellPrice) * Number(item.qty);
  }, 0)
);

const addToCart = () => {
  if (!selectedProduct.value || selectedQty.value <= 0) return;
  if (selectedProduct.value.qty < selectedQty.value) {
    alert("Недостаточно товара на складе!");
    return;
  }
  const existing = cart.value.find(
    (c) => c.product.id === selectedProduct.value.id
  );
  if (existing) {
    existing.qty += Number(selectedQty.value);
  } else {
    cart.value.push({
      product: selectedProduct.value,
      qty: Number(selectedQty.value),
    });
  }
  selectedProduct.value = null;
  selectedQty.value = 1;
  saleSearch.value = "";
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter((c) => c !== item);
};

// оформить заказ
const checkout = async () => {
  try {
    if(!cusromer.value) {
        toast.error("Вкажіть іʼмя")
       return
    }
    if (!cart.value.length) return;

    for (const item of cart.value) {
        if (item.product.qty < item.qty) {
        alert("Недостаточно товара: " + item.product.name);
        continue;
    }

        // уменьшаем количество товара
        const productRef = doc(db, "products", item.product.id);
        await updateDoc(productRef, {
            qty: item.product.qty - item.qty,
        });

        // добавляем продажу
        await addDoc(collection(db, "debts"), {
            name: item.product.name,
            qty: item.qty,
            price: item.product.sellPrice,
            cost: item.product.buyPrice,
            sum: item.qty * item.product.sellPrice,
            productId: item.product.id,
            cusromer: cusromer.value,
            status: 'new',
            date: serverTimestamp(),
        });
    }

    cart.value = [];
    await loadProducts();
    toast.success("Борг додано!")
  } catch {
    toast.error("Виникла помилка")
  }
};

async function getProductById(id) {
  try {
    const ref = doc(db, "products", id) // "products" — твоя коллекция
    const snap = await getDoc(ref)

    if (snap.exists()) {
      return { id: snap.id, ...snap.data() }
    } else {
      console.log("Документ не найден")
      return null
    }
  } catch (e) {
    console.error("Ошибка при получении:", e)
    return null
  }
}

const handleReturnProcuct = (item) => {
  const ok = confirm("Повернути товар? 🤔")
  if (!ok) return 
  returnProduct(item)
}


const handleCloseDebit = (item) => {
  const ok = confirm("Закрити борг? 🤔")

  if (!ok) return 

  closeDebit(item)
}


async function returnProduct(item) {
  try {
    const debtsRef = doc(db, "debts", item.id) 
    const productRef = doc(db, "products", item.productId);
    const product = await getProductById(item.productId);
    if (product) {
      await updateDoc(debtsRef, {
        status: 'refund'
      })
      await updateDoc(productRef, {
        qty: product.qty += 1,
      });
      toast.success("Товар повернено")
    } else {
       toast.error("Виникла помилка")
    }
  } catch (e) {
     toast.error("Виникла помилка")
    console.error("Ошибка при удалении:", e)
  }
}

async function closeDebit(item) {
    try {
      const debtsRef = doc(db, "debts", item.id) 
      await updateDoc(debtsRef, {
        status: 'paid'
      })

      // добавляем продажу
      await addDoc(collection(db, "sales"), {
          name: item.name,
          qty: item.qty,
          price: item.price,
          cost: item.cost,
          sum: item.qty * item.price,
          productId: item.productId,
          date: serverTimestamp(),
      });

      toast.success("Борг оплатили")
    } catch (e) {
      toast.error("Виникла помилка")
      console.log(e)
    }
}

// ---------------- INIT ----------------
onMounted(async () => {
  await loadProducts();

    // начало и конец сегодняшнего дня
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const q = query(
    collection(db, "debts"),
    orderBy("date", "desc")
  )

  onSnapshot(q, snapshot => {
    debts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })

});
</script>

<style>
.homa-page .stats-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 40px 0;
}

.homa-page .total {
    font-size: 18px;
}

.new-sale {
    border: 1px solid #2c3e19;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
}

.new-sale h3 {
    margin: 0 0 20px 0;

}

.search-product {
    border: 2px solid #000;
    border-radius: 6px;
    width: 400px;
}

.search-product:focus, .search-product:active {
    border: 2px solid #2c3e19;
    outline: none;
}

.homa-page .actions {
    display: flex;
    justify-content: flex-end;
}

.homa-page .actions button {
    padding: 11px 22px;
    border: 1px solid #06402B;
    border-radius: 8px;
    background-color: #06402B;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
}
.homa-page .actions button.hide-me {
    opacity: 0;
}

.remove {
    color: #ff0000;
    cursor: pointer;

}

.new-salle-header {
    display: flex;
    justify-content: space-between;
}

.no-sales {
    padding: 20px;
    text-align: center;
}

.debts-user-name label {
  display: block;
}

.debts-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>