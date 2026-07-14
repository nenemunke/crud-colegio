import api from "../../api/axiosInstance";
import type { EstudianteData } from "./estudiantes.types.ts";

// Función para listar todos los estudiantes
export const getEstudiantes = () => api.get("/estudiantes");

// Función para crear un nuevo estudiante
export const createEstudiante = (data: EstudianteData) =>
  api.post("/estudiantes", data);

// Función para borrar un estudiante
export const deleteEstudiante = (id: string) =>
  api.delete(`/estudiantes/${id}`);
