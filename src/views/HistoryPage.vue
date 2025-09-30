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
                    <div class="stats default-blur">Прибуток: <b>{{ todayStats.profit?.toFixed(2) }}грн</b></div>
                </div>

                <div>
                    <h4>Тиждень</h4>
                    <div class="stats">Каса: <b>{{ weekStats.revenue?.toFixed(2) }}</b></div>
                    <div class="stats default-blur">Собівартість: <b>{{ weekStats.cost?.toFixed(2) }}</b></div>
                    <div class="stats default-blur">Прибуток: <b>{{ weekStats.profit?.toFixed(2) }}</b></div>
                </div>

                <div>
                    <h4>Місяць</h4>
                    <div class="stats">Каса: <b>{{ monthStats.revenue?.toFixed(2) }}</b></div>
                    <div class="stats default-blur">Собівартість: <b>{{ monthStats.cost?.toFixed(2) }}</b></div>
                    <div class="stats default-blur">Прибуток: <b>{{ monthStats.profit?.toFixed(2) }}</b></div>
                </div>
            </div>
        </div>
        <div>
            <div class="section-header">
                <h3>Всі Продажі ({{ filteredSales.length }})</h3>
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
                        <th>Кіл-ть</th>
                        <th>Ціна</th>
                        <th>Сума</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(s, i) in filteredSales" :key="i">
                        <td style="width: 200px;">{{ new Date(s.date.seconds * 1000).toLocaleString() }}</td>
                        <td class="text-capitalize">{{ s.name }}</td>
                        <td>{{ s.qty }}</td>
                        <td>{{ s.price?.toFixed(2) }}</td>
                        <td>{{ s.sum?.toFixed(2) }}</td>
                    </tr>
                </tbody>
          </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase' // импорт твоей конфигурации firebase.js
import { collection, getDocs, query, onSnapshot, where, orderBy } from "firebase/firestore"
const salesCollection = collection(db, "sales")
const sales = ref([])
const filterDate = ref('')
const filteredSales = ref([])

// Загружаем все продажи
async function loadSales() {
  const snapshot = await getDocs(salesCollection)
  sales.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}


function applyFilters() {
    // допустим, у тебя есть дата, например 2025-08-23
    let qry = query(salesCollection, orderBy("date", "desc"))
    if (filterDate.value) {
        const selectedDate = new Date(filterDate.value)

        // начало и конец дня
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        qry = query(
            salesCollection,
            where("date", ">=", startOfDay),
            where("date", "<=", endOfDay),
            orderBy("date", "desc")
        )
    }
    
    onSnapshot(qry, snapshot => {
        filteredSales.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
}


// 🔧 Приводим поле date к JS Date из любых форматов (Timestamp, ISO-строка и т.п.)
function toDate(d) {
  if (!d) return null
  if (d instanceof Date) return d
  if (typeof d?.toDate === 'function') return d.toDate() // Firestore Timestamp
  if (typeof d === 'string' || typeof d === 'number') return new Date(d)
  if (typeof d === 'object' && 'seconds' in d) {
    // сериализованный Timestamp { seconds, nanoseconds }
    return new Date(d.seconds * 1000 + Math.floor((d.nanoseconds || 0) / 1e6))
  }
  return new Date(d)
}

function startOfDay(date = new Date()) {
  const d = new Date(date); d.setHours(0,0,0,0); return d
}
function endOfDay(date = new Date()) {
  const d = new Date(date); d.setHours(23,59,59,999); return d
}

function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() || 7 // воскресенье = 0 → 7
  if (day !== 1) d.setDate(d.getDate() - (day - 1)) // понедельник
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfWeek(date = new Date()) {
  const d = startOfWeek(date)
  d.setDate(d.getDate() + 6) // воскресенье
  d.setHours(23, 59, 59, 999)
  return d
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
}

function endOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

// ✅ Универсальная функция подсчёта
function calcStats(period) {
  let from = null
  let to = null

  switch (period) {
    case "today":
      from = startOfDay()
      to = endOfDay()
      break
    case "week":
      from = startOfWeek()
      to = endOfWeek()
      break
    case "month":
      from = startOfMonth()
      to = endOfMonth()
      break
    default:
      from = null
      to = null
  }

  const filtered = sales.value.filter(s => {
    const d = toDate(s.date)
    if (!d) return false
    return (!from || d >= from) && (!to || d <= to)
  })

  const revenue = filtered.reduce((acc, s) => acc + Number(s.sum ?? s.price * s.qty), 0)
  const cost = filtered.reduce((acc, s) => acc + Number(s.cost ?? 0) * Number(s.qty ?? 1), 0)
  const profit = revenue - cost

  return { revenue, cost, profit, count: filtered.length }
}

// 🧮 computed
const todayStats = computed(() => calcStats("today"))
const weekStats  = computed(() => calcStats("week"))
const monthStats = computed(() => calcStats("month"))

// Загружаем при старте
onMounted(() => {
  loadSales()

  applyFilters()
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