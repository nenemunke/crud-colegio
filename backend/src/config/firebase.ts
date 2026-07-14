import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json";

// Inicializamos la aplicación de Firebase aplicando el tipo ServiceAccount
initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

// Inicializamos la base de datos Firestore
const db = getFirestore();

export { db };
