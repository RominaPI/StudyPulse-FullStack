import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface Post {
  id: string; content: string; authorName?: string;
  reactionsCount?: number; createdAt?: string;
}

export default function Feed() {
  const [items, setItems] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const load = () => api<Post[]>("/feed").then(setItems).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api("/feed", { method: "POST", body: JSON.stringify({ content }) });
      setContent(""); load();
    } catch (e: any) { setErr(e.message); }
  };

  const react = async (id: string) => {
    try {
      await api(`/feed/${id}/reactions`, { method: "POST", body: JSON.stringify({ type: "heart" }) });
      load();
    } catch (e: any) { setErr(e.message); }
  };

  return (
    <>
      <div className="topbar">
        <div><h1 className="h1">Feed</h1><p className="muted">Comparte avances con la comunidad</p></div>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={post}>
          <textarea className="textarea" rows={3}
            placeholder="¿En qué estás trabajando hoy?"
            value={content} onChange={(e) => setContent(e.target.value)} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button className="btn btn-primary">Publicar</button>
          </div>
        </form>
      </div>
      {err && <div className="alert" style={{ marginBottom: 12 }}>{err}</div>}
      <div className="list">
        {items.length === 0 && <p className="muted">No hay publicaciones aún.</p>}
        {items.map((p) => (
          <div className="card" key={p.id}>
            <div style={{ fontWeight: 600 }}>{p.authorName ?? "Estudiante"}</div>
            <p style={{ margin: "8px 0" }}>{p.content}</p>
            <button className="btn btn-ghost" onClick={() => react(p.id)}>
              ♥ {p.reactionsCount ?? 0}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
