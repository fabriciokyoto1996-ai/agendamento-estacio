// src/lib/storage.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  setDoc,
  getDoc
} from "firebase/firestore";

const COLLECTION = "agendamentos";
const SETTINGS_COLLECTION = "configuracoes"; // nova coleção para status
const LOCAL_KEY = "scheduling_appointments";

// 🔄 Busca todos os agendamentos (Firestore → fallback localStorage)
export const getAppointments = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      phone: d.data().phone || "" // garante campo vazio se não existir
    }));

    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    } catch (e) {
      // ignora falhas de cache local
    }

    return items;
  } catch (err) {
    console.warn("Firestore read failed, falling back to localStorage:", err);
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      // garante compatibilidade — adiciona phone se faltar
      return parsed.map(item => ({ ...item, phone: item.phone || "" }));
    } catch (e) {
      return [];
    }
  }
};

// 💾 Salva novo agendamento (Firestore + cache local)
export const saveAppointment = async (appointment) => {
  const payload = {
    ...appointment,
    phone: appointment.phone || "", // inclui telefone
    createdAt: appointment.createdAt ?? new Date().toISOString()
  };

  try {
    const ref = await addDoc(collection(db, COLLECTION), payload);
    const newItem = { id: ref.id, ...payload };

    try {
      const current = await getAppointments();
      localStorage.setItem(LOCAL_KEY, JSON.stringify([newItem, ...current]));
    } catch (e) {}

    return { ok: true, id: ref.id };
  } catch (err) {
    console.warn("Firestore write failed, saving to localStorage:", err);
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      const arr = raw ? JSON.parse(raw) : [];
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

// 🗑️ Exclui agendamento (Firestore → fallback localStorage)
export const deleteAppointment = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
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

// 🧹 Apagar todos os agendamentos (Firestore + localStorage)
export const deleteAllAppointments = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const batchDeletes = snapshot.docs.map((d) => deleteDoc(doc(db, COLLECTION, d.id)));
    await Promise.all(batchDeletes);

    localStorage.removeItem(LOCAL_KEY);
    console.log("Todos os agendamentos foram excluídos.");
    return true;
  } catch (err) {
    console.error("Erro ao apagar todos os agendamentos:", err);
    throw err;
  }
};

// ⚙️ Obter status do sistema (ON/OFF)
export const getSystemStatus = async () => {
  try {
    const ref = doc(db, SETTINGS_COLLECTION, "sistema");
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data().status || "ON";
    }
    return "ON";
  } catch (err) {
    console.error("Erro ao buscar status do sistema:", err);
    return "ON"; // fallback
  }
};

// ⚙️ Definir status do sistema (ON/OFF)
export const setSystemStatus = async (status) => {
  try {
    const ref = doc(db, SETTINGS_COLLECTION, "sistema");
    await setDoc(ref, { status, updatedAt: new Date().toISOString() });
    console.log("Status atualizado para:", status);
    return true;
  } catch (err) {
    console.error("Erro ao definir status do sistema:", err);
    throw err;
  }
};
