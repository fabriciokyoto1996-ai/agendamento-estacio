// src/lib/config.js
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CONFIG_DOC = "configuracoes/agenda";

/**
 * 🔹 Buscar configuração da agenda
 * Retorna objeto { startDate, endDate, daysOfWeek, startHour, endHour, interval }
 */
export const getAgendaConfig = async () => {
  try {
    const docRef = doc(db, CONFIG_DOC);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      console.warn("⚠️ Nenhuma configuração encontrada no Firestore.");
      return null;
    }
  } catch (error) {
    console.error("❌ Erro ao obter configurações:", error);
    return null;
  }
};

/**
 * 🔹 Salvar configuração da agenda
 * @param {object} config - objeto com as configurações da agenda
 */
export const saveAgendaConfig = async (config) => {
  try {
    await setDoc(doc(db, CONFIG_DOC), config);
    console.log("✅ Configurações salvas com sucesso.");
    return true;
  } catch (error) {
    console.error("❌ Erro ao salvar configurações:", error);
    return false;
  }
};
