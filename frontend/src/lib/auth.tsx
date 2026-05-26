import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, tokenStorage } from "./api";

export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: { email: string; password: string; username: string; fullName: string }) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = tokenStorage.getUser();
    if (cached) setUser(cached);
    const token = tokenStorage.get();
    if (!token) { setLoading(false); return; }
    api<User>("/auth/me")
      .then((u) => { setUser(u); tokenStorage.setUser(u); })
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api<{ accessToken: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokenStorage.set(res.accessToken);
    tokenStorage.setUser(res.user);
    setUser(res.user);
  };

  const register = async (p: { email: string; password: string; username: string; fullName: string }) => {
    const res = await api<{ accessToken: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(p),
    });
    tokenStorage.set(res.accessToken);
    tokenStorage.setUser(res.user);
    setUser(res.user);
  };

  const logout = () => { tokenStorage.clear(); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth fuera de AuthProvider");
  return c;
}
