// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 Suas credenciais do Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyCKxF36Gu_MplhQDwZjqS9LE_T_aDJERnU",
  authDomain: "agendamento-estacio.firebaseapp.com",
  projectId: "agendamento-estacio",
  storageBucket: "agendamento-estacio.firebasestorage.app",
  messagingSenderId: "212110386009",
  appId: "1:212110386009:web:dcc67ff0afde519650a248",
  measurementId: "G-QE7C768HP6"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Exporta o Firestore (banco de dados)
export const db = getFirestore(app);
