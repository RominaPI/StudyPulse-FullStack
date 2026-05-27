import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface Grupo { id: string; name: string; description?: string; memberCount?: number; }

export default function Grupos() {
  const [items, setItems] = useState<Grupo[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const load = () =>
    api<Grupo[]>("/study-groups").then(setItems).catch((e) => setErr(e.message));

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/study-groups", { method: "POST", body: JSON.stringify({ name, description }) });
      setName(""); setDescription(""); load();
    } catch (e: any) { setErr(e.message); }
  };

  return (
    <>
      <div className="topbar">
        <div><h1 className="h1">Grupos de estudio</h1><p className="muted">Colabora con tus compañeros</p></div>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Crear grupo</h3>
          <form onSubmit={create}>
            <div className="field"><label className="label">Nombre</label>
              <input className="input" required value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field"><label className="label">Descripción</label>
              <textarea className="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <button className="btn btn-primary">Crear</button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Mis grupos</h3>
          {err && <div className="alert" style={{ marginBottom: 12 }}>{err}</div>}
          <div className="list">
            {items.length === 0 && <p className="muted">Aún no hay grupos.</p>}
            {items.map((g) => (
              <div className="list-item" key={g.id}>
                <div>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <div className="muted">{g.description}</div>
                </div>
                <span className="badge badge-indigo">{g.memberCount ?? 0} miembros</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
