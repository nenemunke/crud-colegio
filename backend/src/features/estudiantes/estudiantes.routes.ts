import { Router } from "express";
// Actualiza tu importación para traer las 4 funciones
import {
  registrarEstudiante,
  listarEstudiantes,
  modificarEstudiante,
  borrarEstudiante,
} from "./estudiantes.controller";

const router = Router();

// CRUD

// Rutas generales (afectan a la colección)
router.post("/", registrarEstudiante);
router.get("/", listarEstudiantes);

// Rutas específicas (afectan a un documento por su ID)
// El ":id" es un comodín que Express leerá y pasará al controlador
router.put("/:id", modificarEstudiante);
router.delete("/:id", borrarEstudiante);

export default router;
