import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Priority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

type Status =
  | "todo"
  | "in_progress"
  | "review"
  | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  due_date?: string;
}

const priorityBadge: Record<
  Priority,
  string
> = {
  low: "badge-green",
  medium: "badge-teal",
  high: "badge-coral",
  urgent: "badge-coral",
};

export default function Tareas() {

  const [items, setItems] =
    useState<Task[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    due_date: "",
  });

  const [err, setErr] =
    useState<string | null>(null);

  const load = () =>
    api<Task[]>("/tasks")
      .then(setItems)
      .catch((e) =>
        setErr(e.message),
      );

  useEffect(() => {
    load();
  }, []);

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      setErr(null);

      await api("/tasks", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setForm({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
      });

      load();

    } catch (e: any) {
      setErr(e.message);
    }
  };

  const toggle = async (
    t: Task,
  ) => {

    const next: Status =
      t.status === "done"
        ? "todo"
        : "done";

    try {

      await api(`/tasks/${t.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: next,
        }),
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
          <h1 className="h1">
            Tareas
          </h1>

          <p className="muted">
            Gestiona tus pendientes
          </p>
        </div>
      </div>

      <div className="grid grid-2">

        <div className="card">

          <h3 style={{ marginTop: 0 }}>
            Nueva tarea
          </h3>

          <form onSubmit={submit}>

            <div className="field">
              <label className="label">
                Título
              </label>

              <input
                className="input"
                required
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">
                Descripción
              </label>

              <textarea
                className="textarea"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">
                Prioridad
              </label>

              <select
                className="select"
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority:
                      e.target
                        .value as Priority,
                  })
                }
              >
                <option value="low">
                  Baja
                </option>

                <option value="medium">
                  Media
                </option>

                <option value="high">
                  Alta
                </option>

                <option value="urgent">
                  Urgente
                </option>
              </select>
            </div>

            <div className="field">
              <label className="label">
                Fecha límite
              </label>

              <input
                className="input"
                type="date"
                value={form.due_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    due_date:
                      e.target.value,
                  })
                }
              />
            </div>

            <button className="btn btn-primary">
              Crear
            </button>

          </form>
        </div>

        <div className="card">

          <h3 style={{ marginTop: 0 }}>
            Listado
          </h3>

          {err && (
            <div
              className="alert"
              style={{
                marginBottom: 12,
              }}
            >
              {err}
            </div>
          )}

          <div className="list">

            {items.length === 0 && (
              <p className="muted">
                Sin tareas todavía.
              </p>
            )}

            {items.map((t) => (
              <div
                className="list-item"
                key={t.id}
              >
                <div>

                  <div
                    style={{
                      fontWeight: 600,
                      textDecoration:
                        t.status ===
                        "done"
                          ? "line-through"
                          : "none",
                    }}
                  >
                    {t.title}
                  </div>

                  <div className="muted">
                    {t.description}
                  </div>

                  <span
                    className={
                      "badge " +
                      priorityBadge[
                        t.priority
                      ]
                    }
                    style={{
                      marginTop: 6,
                    }}
                  >
                    {t.priority}
                  </span>

                </div>

                <button
                  className="btn btn-ghost"
                  onClick={() =>
                    toggle(t)
                  }
                >
                  {t.status === "done"
                    ? "Reabrir"
                    : "Completar"}
                </button>

              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}