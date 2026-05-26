import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function Sesiones() {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [seconds, setSeconds] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          window.clearInterval(ref.current!);
          setRunning(false);
          if (mode === "focus") {
            api("/study-sessions", {
              method: "POST",
              body: JSON.stringify({ durationMinutes: FOCUS / 60, type: "pomodoro" }),
            }).catch(() => {});
            setMode("break"); return BREAK;
          } else {
            setMode("focus"); return FOCUS;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (ref.current) window.clearInterval(ref.current); };
  }, [running, mode]);

  const reset = () => {
    setRunning(false);
    setSeconds(mode === "focus" ? FOCUS : BREAK);
  };

  return (
    <>
      <div className="topbar">
        <div><h1 className="h1">Sesiones de estudio</h1><p className="muted">Temporizador Pomodoro</p></div>
      </div>
      <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span className={"badge " + (mode === "focus" ? "badge-pink" : "badge-green")}>
            {mode === "focus" ? "Enfoque" : "Descanso"}
          </span>
        </div>
        <div className="timer" style={{ color: mode === "focus" ? "var(--pink)" : "var(--green)" }}>
          {fmt(seconds)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
          <button className="btn btn-primary" onClick={() => setRunning((r) => !r)}>
            {running ? "Pausar" : "Iniciar"}
          </button>
          <button className="btn btn-ghost" onClick={reset}>Reiniciar</button>
        </div>
      </div>
    </>
  );
}
