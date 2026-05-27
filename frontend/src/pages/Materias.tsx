import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface Materia {
  id: string;
  name: string;
  code?: string;
  professor?: string;
}

export default function Materias() {
  const [items, setItems] = useState<Materia[]>([]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    professor: "",
  });

  const [err, setErr] = useState<string | null>(null);

  const load = () => {
    api<Materia[]>("/subjects")
      .then(setItems)
      .catch((e) => setErr(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setErr(null);

      await api("/subjects", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setForm({
        name: "",
        code: "",
        professor: "",
      });

      load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">Materias</h1>
          <p className="muted">
            Organiza tu malla académica
          </p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Añadir materia
          </h3>

          <form onSubmit={submit}>
            <div className="field">
              <label className="label">
                Nombre
              </label>

              <input
                className="input"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">
                Código
              </label>

              <input
                className="input"
                required
                placeholder="Ej. TC2005"
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">
                Profesor
              </label>

              <input
                className="input"
                value={form.professor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    professor: e.target.value,
                  })
                }
              />
            </div>

            <button className="btn btn-primary">
              Añadir
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            Mis materias
          </h3>

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
                Aún no hay materias.
              </p>
            )}

            {items.map((m) => (
              <div
                className="list-item"
                key={m.id}
              >
                <div>
                  <div
                    style={{ fontWeight: 600 }}
                  >
                    {m.name}
                  </div>

                  <div className="muted">
                    {m.code} · {m.professor}
                  </div>
                </div>

                <span className="badge badge-teal">
                  Activa
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}