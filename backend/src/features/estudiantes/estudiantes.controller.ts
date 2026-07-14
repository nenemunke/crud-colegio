import { Request, Response } from "express";
import * as EstudiantesService from "./estudiantes.service";

export const registrarEstudiante = async (req: Request, res: Response) => {
  try {
    // Extraemos los datos que nos enviará el Frontend en el cuerpo (body) de la petición
    const datosEstudiante = req.body;

    // Validación súper básica
    if (!datosEstudiante.nombre || !datosEstudiante.curso) {
      // Usamos return explícito para detener la ejecución y resolver el error de TS
      return res
        .status(400)
        .json({ error: "El nombre y el curso son obligatorios" });
    }

    // Llamamos a nuestro servicio
    const nuevoEstudiante =
      await EstudiantesService.crearEstudiante(datosEstudiante);

    // Respondemos con éxito (código 201: Creado)
    return res.status(201).json({
      mensaje: "Estudiante registrado con éxito",
      data: nuevoEstudiante,
    });
  } catch (error) {
    // Imprimimos el error real en nuestra terminal de VSCode
    console.error("Error capturado en el controlador:", error);

    // Le devolvemos el error real a Thunder Client
    return res.status(500).json({
      error: "Error interno del servidor",
      detalle: String(error),
    });
  }
};

export const listarEstudiantes = async (req: Request, res: Response) => {
  try {
    const estudiantes = await EstudiantesService.obtenerEstudiantes();

    // Devolvemos la lista con un código 200 (OK)
    return res.status(200).json(estudiantes);
  } catch (error) {
    console.error("Error capturado al listar:", error);
    return res.status(500).json({
      error: "Error interno al obtener los estudiantes",
      detalle: String(error),
    });
  }
};

export const modificarEstudiante = async (req: Request, res: Response) => {
  try {
    // Extraemos el ID y lo afirmamos como string
    const id = req.params.id as string;
    const datos = req.body;

    await EstudiantesService.actualizarEstudiante(id, datos);

    return res.status(200).json({
      mensaje: "Registro actualizado con éxito",
    });
  } catch (error) {
    console.error("Error capturado al actualizar:", error);
    return res.status(500).json({
      error: "Error interno al actualizar el estudiante",
      detalle: String(error),
    });
  }
};

export const borrarEstudiante = async (req: Request, res: Response) => {
  try {
    // Extraemos el ID y lo afirmamos como string
    const id = req.params.id as string;

    await EstudiantesService.eliminarEstudiante(id);

    return res.status(200).json({
      mensaje: "Estudiante eliminado del sistema",
    });
  } catch (error) {
    console.error("Error capturado al eliminar:", error);
    return res.status(500).json({
      error: "Error interno al eliminar el estudiante",
      detalle: String(error),
    });
  }
};
