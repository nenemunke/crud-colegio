// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { EstudiantesList } from "./features/estudiantes/components/EstudiantesList";
import { Dashboard } from "./pages/Dashboard/dashboard";
import { Login } from "./pages/Login/Login";
import { PrivateRoute } from "./auth/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="estudiantes" element={<EstudiantesList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
