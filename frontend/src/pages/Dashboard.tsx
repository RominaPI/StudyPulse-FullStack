import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface Stats {
  groups?: number;
  subjects?: number;
  tasks?: number;
  focusMinutes?: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Stats>("/dashboard/stats").then(setStats).catch((e) => setErr(e.message));
  }, []);

  const items = [
    { label: "Grupos", value: stats?.groups ?? 0, color: "badge-pink" },
    { label: "Materias", value: stats?.subjects ?? 0, color: "badge-teal" },
    { label: "Tareas activas", value: stats?.tasks ?? 0, color: "badge-coral" },
    { label: "Minutos enfocado", value: stats?.focusMinutes ?? 0, color: "badge-indigo" },
  ];

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">Dashboard</h1>
          <p className="muted">Tu actividad de estudio en un vistazo</p>
        </div>
      </div>
      {err && <div className="alert" style={{ marginBottom: 16 }}>{err}</div>}
      <div className="grid grid-4">
        {items.map((s) => (
          <div className="card" key={s.label}>
            <div className={"badge " + s.color}>{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}

//esteeseltokensecreto
//esteeselotrotokensecreto

//studypulse-fullstack-production.up.railway.app