import { Outlet, Link } from "react-router-dom";
// import "./Layout.scss";

export const Layout = () => {
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h2>Mi Colegio</h2>
        <ul>
          <li>
            <Link to="/dashboard">📊 Dashboard</Link>
          </li>
          <li>
            <Link to="/estudiantes">🎓 Estudiantes</Link>
          </li>
          {/* Aquí podrás agregar más fácilmente: */}
          <li>
            <Link to="/profesores">👨‍🏫 Profesores</Link>
          </li>
        </ul>
      </nav>
      <main className="content">
        <Outlet /> {/* Aquí se renderizará la página actual */}
      </main>
    </div>
  );
};
