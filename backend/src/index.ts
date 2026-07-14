import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/firebase";
import estudiantesRoutes from "./features/estudiantes/estudiantes.routes";

// Configuramos las variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
// CORS permite que nuestro frontend (en el puerto 5173) se comunique con este backend
app.use(cors());
// Permite que nuestro servidor entienda datos en formato JSON con un límite de hasta 10MB para que pasen las imágenes en Base64
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Endpoint de prueba
app.get("/api/health", async (req, res) => {
  try {
    // Hacemos una lectura rápida a la base de datos para confirmar conexión
    // No importa si la colección "estudiantes" aún no existe, Firebase no dará error por leerla
    await db.collection("estudiantes").limit(1).get();

    res.status(200).json({
      estado: "Activo",
      mensaje:
        "¡Servidor Node.js funcionando y conectado a Firebase Firestore!",
    });
  } catch (error) {
    res.status(500).json({
      estado: "Error",
      mensaje: "Fallo al conectar con Firebase",
      error: String(error),
    });
  }
});

// Conectamos la cápsula de estudiantes
app.use("/api/estudiantes", estudiantesRoutes);

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(
    `Servidor de la escuela ejecutándose en http://localhost:${PORT}`,
  );
});
