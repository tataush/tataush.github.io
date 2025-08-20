// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKITT9HDYZ2BagHd_TbDzUP-NpKH8ci10",
  authDomain: "app-ivan-t.firebaseapp.com",
  databaseURL: "https://app-ivan-t.firebaseio.com",
  projectId: "app-ivan-t",
  storageBucket: "app-ivan-t.firebasestorage.app",
  messagingSenderId: "690548588154",
  appId: "1:690548588154:web:a00ca5bc153efb332085c3",
  measurementId: "G-Y4E8NL284W"
};

// Инициализация
const app = initializeApp(firebaseConfig);

// Firestore база
const db = getFirestore(app);

export { db };