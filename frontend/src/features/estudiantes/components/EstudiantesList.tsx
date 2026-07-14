import { useEffect, useState, useMemo } from "react";
import {
  getEstudiantes,
  deleteEstudiante,
  createEstudiante,
  updateEstudiante,
} from "../estudiantes.api";
import type { EstudianteData } from "../estudiantes.types";
import { EstudianteModal } from "./EstudianteModal";
import "./EstudiantesList.scss";

export const EstudiantesList = () => {
  const [estudiantes, setEstudiantes] = useState<EstudianteData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estudianteEditando, setEstudianteEditando] =
    useState<EstudianteData | null>(null);

  // --- ESTADOS PARA LOS FILTROS ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroRendimiento, setFiltroRendimiento] = useState("");

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const respuesta = await getEstudiantes();
        setEstudiantes(respuesta.data);
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchEstudiantes();
  }, []);

  // Extraer cursos únicos automáticamente para el menú desplegable
  const cursosDisponibles = useMemo(() => {
    const cursos = estudiantes.map((est) => est.curso);
    return [...new Set(cursos)]; // Filtra duplicados
  }, [estudiantes]);

  // --- LÓGICA DE FILTRADO (Se ejecuta sola cuando cambian los estados) ---
  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter((est) => {
      // 1. Filtro por búsqueda de texto (Nombre)
      const coincideBusqueda = est.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      // 2. Filtro por Curso
      const coincideCurso = filtroCurso === "" || est.curso === filtroCurso;

      // 3. Filtro por Rendimiento (Promedio)
      let coincideRendimiento = true;
      if (filtroRendimiento === "excelencia")
        coincideRendimiento = est.promedio >= 6.0;
      if (filtroRendimiento === "riesgo")
        coincideRendimiento = est.promedio < 4.0;
      if (filtroRendimiento === "aprobado")
        coincideRendimiento = est.promedio >= 4.0 && est.promedio < 6.0;

      return coincideBusqueda && coincideCurso && coincideRendimiento;
    });
  }, [estudiantes, busqueda, filtroCurso, filtroRendimiento]);

  // Lógica para borrar con confirmación
  const handleBorrar = async (id: string, nombre: string, curso: string) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar al estudiante ${nombre} del ${curso}?`,
    );

    if (!confirmar) return;

    try {
      await deleteEstudiante(id);
      setEstudiantes(estudiantes.filter((est) => est.id !== id));
    } catch (error) {
      console.error("Error al borrar:", error);
      alert("Hubo un error al intentar eliminar el registro.");
    }
  };

  // Lógica para manejar el guardado desde el modal
  const handleGuardarEstudiante = async (datosFormulario: EstudianteData) => {
    try {
      if (estudianteEditando && estudianteEditando.id) {
        await updateEstudiante(estudianteEditando.id, datosFormulario);
        setEstudiantes(
          estudiantes.map((est) =>
            est.id === estudianteEditando.id
              ? { ...datosFormulario, id: estudianteEditando.id }
              : est,
          ),
        );
      } else {
        const respuesta = await createEstudiante(datosFormulario);
        setEstudiantes([...estudiantes, respuesta.data.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un problema al guardar el estudiante.");
    }
  };

  const obtenerColorPromedio = (promedio: number) => {
    if (promedio >= 6.0) return "excelencia";
    if (promedio >= 4.0) return "aprobado";
    return "reprobado";
  };

  if (cargando)
    return <div className="cargando">Cargando base de datos...</div>;

  return (
    <div className="dashboard-container">
      {/* Cabecera con título y botón de Agregar */}
      <div className="header-seccion">
        <h2>Registro de Estudiantes</h2>
        <button
          className="btn-primario"
          onClick={() => {
            setEstudianteEditando(null);
            setIsModalOpen(true);
          }}
        >
          + Agregar Estudiante
        </button>
      </div>

      {/* --- NUEVA BARRA DE FILTROS --- */}
      <div className="filtros-bar">
        <div className="filtro-grupo">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>
        <div className="filtro-grupo">
          <select
            value={filtroCurso}
            onChange={(e) => setFiltroCurso(e.target.value)}
          >
            <option value="">Todos los cursos</option>
            {cursosDisponibles.map((curso) => (
              <option key={curso} value={curso}>
                {curso}
              </option>
            ))}
          </select>
        </div>
        <div className="filtro-grupo">
          <select
            value={filtroRendimiento}
            onChange={(e) => setFiltroRendimiento(e.target.value)}
          >
            <option value="">Rendimiento (Todos)</option>
            {/* Usamos &gt; en lugar de > */}
            <option value="excelencia">⭐ Excelencia (&gt;= 6.0)</option>
            <option value="aprobado">✅ Aprobado (4.0 - 5.9)</option>
            {/* Aquí ya tenías el &lt; correctamente */}
            <option value="riesgo">⚠️ En Riesgo (&lt; 4.0)</option>
          </select>
        </div>
      </div>

      <div className="estudiantes-grid">
        {estudiantesFiltrados.length === 0 ? (
          <div className="sin-resultados">
            No se encontraron estudiantes con estos filtros.
          </div>
        ) : (
          estudiantesFiltrados.map((estudiante) => (
            <div key={estudiante.id} className="estudiante-card">
              <div className="card-checkbox">
                <input type="checkbox" title="Seleccionar estudiante" />
              </div>

              <div className="card-header">
                <div
                  className="avatar-placeholder"
                  style={
                    estudiante.foto ? { backgroundColor: "transparent" } : {}
                  }
                >
                  {estudiante.foto ? (
                    <img
                      src={estudiante.foto}
                      alt={estudiante.nombre}
                      className="avatar-img"
                    />
                  ) : (
                    estudiante.nombre.charAt(0).toUpperCase()
                  )}
                </div>

                {/* AQUÍ ESTÁ EL CÓDIGO RECUPERADO DE LOS NOMBRES */}
                <div className="info-principal">
                  <h3>{estudiante.nombre}</h3>
                  <span className="curso-badge">{estudiante.curso}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="dato-fila">
                  <span className="label">Promedio:</span>
                  <span
                    className={`promedio-badge ${obtenerColorPromedio(estudiante.promedio)}`}
                  >
                    {estudiante.promedio}
                  </span>
                </div>
                <div className="dato-fila">
                  <span className="label">Ingreso:</span>
                  <span>{estudiante.fechaIngreso}</span>
                </div>
                <div className="dato-fila">
                  <span className="label">Estado:</span>
                  <span
                    className={
                      estudiante.estado ? "texto-activo" : "texto-inactivo"
                    }
                  >
                    {estudiante.estado ? "Matriculado" : "Retirado"}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-editar"
                  onClick={() => {
                    setEstudianteEditando(estudiante);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn-borrar"
                  onClick={() =>
                    handleBorrar(
                      estudiante.id!,
                      estudiante.nombre,
                      estudiante.curso,
                    )
                  }
                >
                  Borrar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <EstudianteModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleGuardarEstudiante}
          estudianteToEdit={estudianteEditando}
        />
      )}
    </div>
  );
};
