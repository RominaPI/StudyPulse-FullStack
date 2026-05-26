import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="h1" style={{ marginBottom: 4 }}>Iniciar sesión</h1>
        <p className="muted" style={{ marginBottom: 20 }}>Bienvenido a Study Pulse</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="tu@universidad.edu" />
          </div>
          <div className="field">
            <label className="label">Contraseña</label>
            <input className="input" type="password" required minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <div className="alert" style={{ marginBottom: 12 }}>{err}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>
          ¿Nuevo aquí? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}
