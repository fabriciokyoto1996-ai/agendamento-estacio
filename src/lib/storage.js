// src/lib/storage.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";

const COLLECTION = "agendamentos";
const LOCAL_KEY = "scheduling_appointments";

// tenta buscar do Firestore; se falhar, usa localStorage
export const getAppointments = async () => {
  // Primeiro: tenta Firestore
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    // salva um cache local (opcional) para fallback
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
    return items;
  } catch (err) {
    console.warn("Firestore read failed, falling back to localStorage:", err);
    // fallback para localStorage
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
};

export const saveAppointment = async (appointment) => {
  // adiciona createdAt automaticamente se não existir
  const payload = {
    ...appointment,
    createdAt: appointment.createdAt ?? new Date().toISOString()
  };

  // tenta salvar no Firestore; se falhar, salva no localStorage
  try {
    const ref = await addDoc(collection(db, COLLECTION), payload);
    // atualiza cache local
    try {
      const current = await getAppointments();
      // coloca novo item no início (com id fornecido pelo Firestore)
      const newItem = { id: ref.id, ...payload };
      localStorage.setItem(LOCAL_KEY, JSON.stringify([newItem, ...current]));
    } catch (e) {}
    return { ok: true, id: ref.id };
  } catch (err) {
    console.warn("Firestore write failed, saving to localStorage:", err);
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      // gerar id simples baseado no timestamp
      const id = Date.now().toString();
      const newItem = { id, ...payload };
      arr.unshift(newItem);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
      return { ok: true, id };
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
      return { ok: false, error: e };
    }
  }
};

export const deleteAppointment = async (id) => {
  // tenta Firestore, se falhar, remove do localStorage
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    // atualiza cache local
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const filtered = arr.filter(a => a.id !== id);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
    } catch (e) {}
    return true;
  } catch (err) {
    console.warn("Firestore delete failed, trying localStorage:", err);
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const filtered = arr.filter(a => a.id !== id);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error("Failed to delete locally:", e);
      return false;
    }
  }
};
