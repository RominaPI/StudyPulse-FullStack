import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="h1" style={{ marginBottom: 4 }}>Crear cuenta</h1>
        <p className="muted" style={{ marginBottom: 20 }}>Únete a tu comunidad universitaria</p>
        <form onSubmit={onSubmit}>
          <div className="field"><label className="label">Nombre completo</label>
            <input className="input" required value={form.fullName} onChange={set("fullName")} /></div>
          <div className="field"><label className="label">Usuario</label>
            <input className="input" required minLength={3} value={form.username} onChange={set("username")} /></div>
          <div className="field"><label className="label">Email</label>
            <input className="input" type="email" required value={form.email} onChange={set("email")} /></div>
          <div className="field"><label className="label">Contraseña</label>
            <input className="input" type="password" required minLength={6} value={form.password} onChange={set("password")} /></div>
          {err && <div className="alert" style={{ marginBottom: 12 }}>{err}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creando…" : "Crear cuenta"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
