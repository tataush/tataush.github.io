<template>
    <div>
        <div class="statistic">
            <h3>📊 Статистика</h3>
            <div class="statistic-container">
            <!-- Статистика -->
                <div>
                    <h4>Сьогодні</h4>
                    <div class="stats total">Каса: <b>{{ todayStats.revenue?.toFixed(2) }}грн</b></div>
                    <div class="stats default-blur">Собівартість: <b>{{ todayStats.cost?.toFixed(2) }}грн</b></div>
                    <div class="stats default-blur">Приботок: <b>{{ todayStats.profit?.toFixed(2) }}грн</b></div>
                </div>

                <div>
                    <h4>Тиждень</h4>
                    <div class="stats">Каса: <b>{{ weekStats.revenue?.toFixed(2) }}</b></div>
                    <div class="stats default-blur">Собівартість: <b>{{ weekStats.cost?.toFixed(2) }}</b></div>
                    <div class="stats default-blur">Приботок: <b>{{ weekStats.profit?.toFixed(2) }}</b></div>
                </div>

                <div>
                    <h4>Місяць</h4>
                    <div class="stats">Каса: <b>{{ monthStats.revenue?.toFixed(2) }}</b></div>
                    <div class="stats default-blur">Собівартість: <b>{{ monthStats.cost?.toFixed(2) }}</b></div>
                    <div class="stats default-blur">Приботок: <b>{{ monthStats.profit?.toFixed(2) }}</b></div>
                </div>
            </div>
        </div>
        <div>
            <h3>Всі Продажі ({{ sales.length }})</h3>
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
                <tbody>
                    <tr v-for="(s, i) in sales" :key="i">
                        <td style="width: 200px;">{{ new Date(s.date * 1000).toLocaleString() }}</td>
                        <td>{{ s.name }}</td>
                        <td>{{ s.qty }}</td>
                        <td>{{ s.price }}</td>
                        <td>{{ s.sum }}</td>
                    </tr>
                </tbody>
          </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase' // импорт твоей конфигурации firebase.js
import { collection, getDocs } from "firebase/firestore"

const sales = ref([])

// Загружаем все продажи
async function loadSales() {
  const snapshot = await getDocs(collection(db, "sales"))
  sales.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Универсальная функция для подсчета статистики
function calcStats(period) {
  const now = new Date();
  let from = null;

  if (period === "today") {
    from = new Date();
    from.setHours(0,0,0,0);
  } else if (period === "week") {
    from = new Date();
    from.setDate(now.getDate() - 7);
  } else if (period === "month") {
    from = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const filtered = sales.value.filter(s => {
    const d = new Date(s.date * 1000);
    return from ? d >= from : true;
  });

  const revenue = filtered.reduce((acc, s) => acc + Number(s.sum), 0);
  const cost = filtered.reduce((acc, s) => acc + Number(s.cost) * Number(s.qty), 0);
  const profit = revenue - cost;

  return { revenue, cost, profit };
}

// computed свойства для статистики
const todayStats = computed(() => calcStats("today"))
const weekStats = computed(() => calcStats("week"))
const monthStats = computed(() => calcStats("month"))

// Загружаем при старте
onMounted(() => {
  loadSales()
})
</script>

<style>
.statistic-container {
    display: flex;
    gap: 60px;
    margin-bottom: 20px;
}

.statistic-container h4 {
    margin: 0 20px 0 0;
}

.statistic h3 {
    margin: 0 0 20px 0;
}

</style>