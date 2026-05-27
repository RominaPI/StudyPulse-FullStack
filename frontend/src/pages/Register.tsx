<div className="field">
  <label className="label">
    Nombre completo
  </label>

  <input
    className="input"
    required
    maxLength={60}
    value={form.full_name}
    onChange={set("full_name")}
  />
</div>

<div className="field">
  <label className="label">
    Username
  </label>

  <input
    className="input"
    required
    value={form.username}
    onChange={set("username")}
  />

  <small className="muted">
    Usa solo letras, números,
    puntos, guiones o guion bajo.
    Sin espacios.
  </small>
</div>

<div className="field">
  <label className="label">
    Email
  </label>

  <input
    className="input"
    type="email"
    required
    value={form.email}
    onChange={set("email")}
  />
</div>

<div className="field">
  <label className="label">
    Contraseña
  </label>

  <input
    className="input"
    type="password"
    required
    minLength={8}
    value={form.password}
    onChange={set("password")}
  />

  <small className="muted">
    Mínimo 8 caracteres.
  </small>
</div>