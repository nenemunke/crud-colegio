import { useState } from "react";
import type { EstudianteData } from "../estudiantes.types";
import "./EstudianteModal.scss";

interface Props {
  onClose: () => void;
  onSave: (data: EstudianteData) => void;
  estudianteToEdit?: EstudianteData | null;
}

// Mantenemos nuestra función fuera del componente
const obtenerEstadoInicial = (): EstudianteData => ({
  nombre: "",
  curso: "",
  promedio: 4.0,
  estado: true,
  fechaIngreso: new Date().toISOString().split("T")[0],
  foto: "",
});

export const EstudianteModal = ({
  onClose,
  onSave,
  estudianteToEdit,
}: Props) => {
  // 1. LA MAGIA: Inicializamos el estado directamente evaluando si hay un estudiante para editar.
  // ¡Adiós useEffect!
  const [formData, setFormData] = useState<EstudianteData>(
    estudianteToEdit || obtenerEstadoInicial(),
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseFloat(value)
            : value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // VALIDACIÓN: Evitamos que la imagen sea mayor a 700kb (700 * 1024 bytes)
      // para no superar el límite de 1MB por documento de Firebase.
      if (file.size > 700 * 1024) {
        alert(
          "La imagen es muy pesada. Por favor, elige una foto de menos de 700kb.",
        );
        return; // Detenemos el proceso
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{estudianteToEdit ? "Editar Estudiante" : "Nuevo Estudiante"}</h3>
          <button className="btn-cerrar" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label>Curso</label>
            <input
              type="text"
              name="curso"
              value={formData.curso}
              onChange={handleChange}
              required
              placeholder="Ej. 3ro Medio A"
            />
          </div>

          <div className="form-group foto-upload-group">
            <label>Foto del Estudiante (Opcional)</label>
            <div className="drag-drop-zone">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
                title="Arrastra o selecciona una imagen"
              />
              {formData.foto ? (
                <img
                  src={formData.foto}
                  alt="Vista previa"
                  className="foto-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <span>📁 Haz clic o arrastra una imagen aquí</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Promedio</label>
              <input
                type="number"
                name="promedio"
                step="0.1"
                min="1.0"
                max="7.0"
                value={formData.promedio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Ingreso</label>
              <input
                type="date"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
              Estudiante Matriculado (Activo)
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              {estudianteToEdit ? "Actualizar Datos" : "Guardar Estudiante"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
