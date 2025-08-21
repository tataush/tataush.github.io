<template>
    <div class="homa-page">
        <div class="actions">
          <button @click="startSale" :class="[{'hide-me': showSaleForm}]">+ Новий продаж</button>
        </div>
        
        <!-- Форма продажи -->
        <div class="new-sale" v-if="showSaleForm" >
            <div class="new-salle-header">
                <h3>Новий продаж</h3>
                <button class="btn btn-red" @click="closeSale">Відмінити</button>
            </div>
            <input v-model="saleSearch" placeholder="Пошук" class="search-product">
            <table v-if="saleSearch">
                    <thead>
                        <tr>
                            <th>Назва</th>
                            <th>В наявності</th>
                            <th>Ціна</th>
                        </tr>
                    </thead>
                    <tbody v-if="filteredProducts?.length">
                        <tr class="pointer" v-for="p in filteredProducts" :key="p.name" @click="chooseProduct(p)">
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
                    <button @click="checkout" class="btn">Оформити покупку</button>
                </div>
            </div>
        </div>

        <div>
            <h3>Продажі за сьогодні</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width: 200px;">Дата, час</th>
                        <th>Товар</th>
                        <th>Кіл-ть</th>
                        <th>Ціна</th>
                        <th>Сума</th>
                    </tr>
                </thead>
                <tbody v-if="sales?.length">
                    <tr v-for="(s, i) in sales" :key="i">
                        <td style="width: 200px;">{{ new Date(s.date * 1000).toLocaleString() }}</td>
                        <td class="text-capitalize">{{ s.name }}</td>
                        <td>{{ s.qty }}</td>
                        <td>{{ s.price?.toFixed(2) }}</td>
                        <td>{{ s.sum?.toFixed(2)}}</td>
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

        <div class="stats-container">
            <div class="stats total">Каса: <b>{{ todayStats.revenue?.toFixed(2) }}грн</b></div>
            <div class="stats default-blur">Собівартість: <b>{{ todayStats.cost?.toFixed(2) }}грн</b></div>
            <div class="stats default-blur">Приботок: <b>{{ todayStats.profit?.toFixed(2) }}грн</b></div>
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
} from "firebase/firestore";

import { useToast } from "vue-toastification"

const toast = useToast()
// ---------------- ПРОДУКТЫ ----------------
const products = ref([]);
const sales = ref([]);
const showSaleForm = ref(false);
const saleSearch = ref("");
const saleQty = ref(1);
const selectedProduct = ref(null);
const selectedQty = ref(1);
const cart = ref([]);

// загрузка данных
const loadProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  products.value = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const loadSales = async () => {
  const querySnapshot = await getDocs(collection(db, "sales"));
  sales.value = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// computed фильтр
const filteredProducts = computed(() =>
  products.value.filter((p) =>
    p.name.toLowerCase().includes(saleSearch.value.toLowerCase())
  )
);

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
        await addDoc(collection(db, "sales"), {
            name: item.product.name,
            qty: item.qty,
            price: item.product.sellPrice,
            cost: item.product.buyPrice,
            sum: item.qty * item.product.sellPrice,
            date: serverTimestamp(),
        });
    }

    cart.value = [];
    await loadProducts();
    await loadSales();
    toast.success("🚀 Чудова робота!")
  } catch {
    toast.error("Виникла помилка")
  }
};

// ---------------- СТАТИСТИКА ----------------
function calcStats(period) {
  const now = new Date();
  let from = null;

  if (period === "today") {
    from = new Date();
    from.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    from = new Date();
    from.setDate(now.getDate() - 7);
  } else if (period === "month") {
    from = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const filtered = sales.value.filter((s) => {
    const d = s.date?.toDate ? s.date.toDate() : new Date(s.date * 1000);
    return from ? d >= from : true;
  });

  const revenue = filtered.reduce((acc, s) => acc + s.sum, 0);
  const cost = filtered.reduce((acc, s) => acc + s.cost * s.qty, 0);
  const profit = revenue - cost;

  return { revenue, cost, profit };
}

const todayStats = computed(() => calcStats("today"));

// ---------------- INIT ----------------
onMounted(async () => {
  await loadProducts();
  await loadSales();
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
</style>