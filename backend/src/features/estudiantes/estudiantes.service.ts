import { db } from "../../config/firebase";

// Definimos la estructura de los datos que esperamos recibir
export interface EstudianteData {
  nombre: string;
  curso: string;
  promedio: number;
  estado: boolean;
  fechaIngreso: string;
  imagenUrl?: string; // Opcional por ahora
}

export const crearEstudiante = async (datos: EstudianteData) => {
  try {
    const nuevaReferencia = await db.collection("estudiantes").add(datos);
    return { id: nuevaReferencia.id, ...datos };
  } catch (error) {
    // Lanzamos el error tal cual viene de Firebase para que el controlador lo lea
    throw error;
  }
};

export const obtenerEstudiantes = async () => {
  try {
    // Apuntamos a la colección y pedimos todos los documentos
    const snapshot = await db.collection("estudiantes").get();

    // Transformamos la respuesta de Firebase en un arreglo (array) limpio
    const listaEstudiantes: any[] = [];
    snapshot.forEach((doc) => {
      listaEstudiantes.push({ id: doc.id, ...doc.data() });
    });

    return listaEstudiantes;
  } catch (error) {
    throw error;
  }
};

export const actualizarEstudiante = async (
  id: string,
  datosActualizados: Partial<EstudianteData>,
) => {
  try {
    // Apuntamos al documento específico usando su ID y lo actualizamos
    await db.collection("estudiantes").doc(id).update(datosActualizados);
    return { id, ...datosActualizados };
  } catch (error) {
    throw error;
  }
};

export const eliminarEstudiante = async (id: string) => {
  try {
    // Apuntamos al documento específico y lo borramos de la faz de Firestore
    await db.collection("estudiantes").doc(id).delete();
    return { id };
  } catch (error) {
    throw error;
  }
};
