
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBLBVToo80X3XQK3ohnC2un2UopNgh0Pb8",
  authDomain: "masportuoro-9c58a.firebaseapp.com",
  projectId: "masportuoro-9c58a",
  storageBucket: "masportuoro-9c58a.appspot.com",
  messagingSenderId: "1088835945019",
  appId: "1:1088835945019:web:01c875760c74708126121e",
  measurementId: "G-KH2VXZQSBW"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pricesDocRef = doc(db, "precios", "metales_preciosos");

// Función para formatear precios
function formatPrice(value) {
  return `$${parseFloat(value).toFixed(2)}`;
}

// Esperar que el DOM esté cargado
window.addEventListener('DOMContentLoaded', () => {
  onSnapshot(pricesDocRef, (docSnap) => {
    console.log("Snapshot recibido:", docSnap.exists(), docSnap.data());
    if (docSnap.exists()) {
      const data = docSnap.data();

      document.querySelectorAll('p.price').forEach(p => {
        const priceId = p.dataset.priceId;
        if (data[priceId] !== undefined) {
          p.textContent = formatPrice(data[priceId]);
        } else {
          p.textContent = "N/A";
        }
      });

      const now = new Date();
      document.getElementById('last-updated').textContent = `Última actualización: ${now.toLocaleString('es-VE', { hour12: false })}`;
    } else {
      document.getElementById('last-updated').textContent = "Documento no existe.";
    }
  }, (error) => {
    console.error("Error al obtener precios:", error);
    document.getElementById('last-updated').textContent = "Error al cargar precios.";
  });
});


