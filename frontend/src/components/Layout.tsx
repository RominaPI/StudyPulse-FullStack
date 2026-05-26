import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/grupos", label: "Grupos" },
  { to: "/materias", label: "Materias" },
  { to: "/tareas", label: "Tareas" },
  { to: "/sesiones", label: "Sesiones" },
  { to: "/feed", label: "Feed" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">Study Pulse</div>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            {l.label}
          </NavLink>
        ))}
        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div className="muted" style={{ marginBottom: 8 }}>{user?.fullName || user?.username}</div>
          <button className="btn btn-ghost" style={{ width: "100%" }}
            onClick={() => { logout(); navigate("/login"); }}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
