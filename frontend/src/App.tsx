import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Grupos from "./pages/Grupos";
import Materias from "./pages/Materias";
import Tareas from "./pages/Tareas";
import Sesiones from "./pages/Sesiones";
import Feed from "./pages/Feed";

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40 }}>Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="grupos" element={<Grupos />} />
        <Route path="materias" element={<Materias />} />
        <Route path="tareas" element={<Tareas />} />
        <Route path="sesiones" element={<Sesiones />} />
        <Route path="feed" element={<Feed />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
