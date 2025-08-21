<template>
    <div>
        <h3>Всі Списання ({{ writeOffs.length }})</h3>
        <table>
            <thead>
                <tr>
                    <th style="width: 200px;">Дата, час</th>
                    <th>Товар</th>
                    <th>Кіл-ть</th>
                    <th>Причина</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(s, i) in writeOffs" :key="i">
                    <td style="width: 200px;">{{ new Date(s.date).toLocaleString() }}</td>
                    <td class="text-capitalize">{{ s.name }}</td>
                    <td>{{ s.qty }}</td>
                    <td>{{ s.reason }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/firebase"
import { ref, onMounted } from "vue"
const writeOffs = ref([])
const writeOffsCollection = collection(db, "writeOffs")
// 🔥 Реактивная подписка вместо getDocs
onMounted(() => {
  onSnapshot(writeOffsCollection, snapshot => {
    writeOffs.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
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