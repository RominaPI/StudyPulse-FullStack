import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface Post {
  _id: string;
  content: string;
  author_id?: string;
  reactions_count?: number;
  createdAt?: string;
}

export default function Feed() {
  const [items, setItems] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const load = async () => {
    try {
      const data = await api<Post[]>("/feed");
      setItems(data);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      await api("/feed", {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      setContent("");
      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const react = async (id: string) => {
    const isLiked = likedIds.has(id);

    // Actualización optimista del estado de likes
    setLikedIds((prev) => {
      const next = new Set(prev);

      if (isLiked) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });

    // Actualización optimista del contador
    setItems((prev) =>
      prev.map((post) =>
        post._id === id
          ? {
              ...post,
              reactions_count:
                (post.reactions_count ?? 0) + (isLiked ? -1 : 1),
            }
          : post
      )
    );

    try {
      await api("/reactions/toggle", {
        method: "POST",
        body: JSON.stringify({
          target_id: id,
          target_type: "post",
          emoji: "❤️",
        }),
      });
    } catch (e: any) {
      setErr(e.message);

      // Si falla, recargamos para restaurar el estado correcto
      load();
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm("¿Eliminar esta publicación?")) return;

    try {
      await api(`/feed/${id}`, {
        method: "DELETE",
      });

      setItems((prev) => prev.filter((p) => p._id !== id));

      setLikedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">Feed</h1>
          <p className="muted">
            Comparte avances con la comunidad
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={post}>
          <textarea
            className="textarea"
            rows={3}
            placeholder="¿En qué estás trabajando hoy?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <button className="btn btn-primary">
              Publicar
            </button>
          </div>
        </form>
      </div>

      {err && (
        <div
          className="alert"
          style={{ marginBottom: 12 }}
        >
          {err}
        </div>
      )}

      <div className="list">
        {items.length === 0 && (
          <p className="muted">
            No hay publicaciones aún.
          </p>
        )}

        {items.map((p) => (
          <div className="card" key={p._id}>
            <div style={{ fontWeight: 600 }}>
              Estudiante
            </div>

            <p style={{ margin: "8px 0" }}>
              {p.content}
            </p>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 8,
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => react(p._id)}
              >
                {likedIds.has(p._id) ? "❤️" : "🤍"}{" "}
                {p.reactions_count ?? 0}
              </button>

              <button
                className="btn btn-danger"
                onClick={() => deletePost(p._id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}