// Este script se encarga de conectar la página con la base de datos de precios en tiempo real.

// Importa las funciones necesarias de Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Variables de configuración proporcionadas por el entorno del Canvas ---
// Estas variables globales son necesarias para la conexión y autenticación
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Inicialización de Firebase ---
let db, auth, userId;
const app = initializeApp(firebaseConfig);

/**
 * Función asíncrona para inicializar Firebase y autenticar al usuario.
 * @returns {Promise<boolean>} Retorna true si la inicialización fue exitosa, false en caso de error.
 */
async function initFirebase() {
    try {
        auth = getAuth(app);
        // Si existe un token de autenticación, úsalo. Si no, inicia sesión anónimamente.
        if (initialAuthToken) {
            const userCredential = await signInWithCustomToken(auth, initialAuthToken);
            userId = userCredential.user.uid;
        } else {
            const userCredential = await signInAnonymously(auth);
            userId = userCredential.user.uid;
        }
        db = getFirestore(app);
        console.log("Firebase inicializado y usuario autenticado con UID:", userId);
        return true;
    } catch (e) {
        console.error("Error al inicializar Firebase:", e);
        return false;
    }
}

/**
 * Función principal que se ejecuta una vez que el DOM ha cargado.
 * Se encarga de conectar a Firestore y escuchar los cambios de precios en tiempo real.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializa Firebase y espera a que la autenticación esté lista
    const isFirebaseReady = await initFirebase();
    if (!isFirebaseReady) {
        return;
    }

    // Define la referencia al documento de precios.
    // Es crucial que esta ruta coincida con la que usas en tu página de administración
    const pricesDocRef = doc(db, `artifacts/${appId}/users/${userId}/prices/current_prices`);
    const lastUpdatedElement = document.getElementById('last-updated');

    // Escucha cambios en tiempo real en el documento de precios
    onSnapshot(pricesDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const priceData = docSnap.data();

            // Itera sobre los datos y actualiza los elementos HTML correspondientes.
            // Los elementos a actualizar son aquellos con el atributo 'data-price-id'.
            for (const key in priceData) {
                const element = document.querySelector(`[data-price-id="${key}"]`);
                if (element && typeof priceData[key] === 'number') {
                    // Actualiza el texto con el valor de la base de datos
                    element.textContent = `$${priceData[key].toFixed(2)}`;
                }
            }

            // Actualiza la fecha y hora de la última modificación
            if (priceData.lastUpdated) {
                const date = new Date(priceData.lastUpdated);
                lastUpdatedElement.textContent = `Última actualización: ${date.toLocaleString()}`;
            }
        } else {
            // Si el documento no existe, muestra un mensaje de no disponibilidad
            console.log("No se encontraron precios guardados.");
            lastUpdatedElement.textContent = "No hay precios disponibles.";
        }
    }, (error) => {
        console.error("Error al escuchar los precios:", error);
        lastUpdatedElement.textContent = "Error al cargar los precios.";
    });
});
