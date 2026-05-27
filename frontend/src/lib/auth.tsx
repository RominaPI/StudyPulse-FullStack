import { createContext, useContext, useState } from "react";
import { api, tokenStorage } from "./api";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(tokenStorage.getUser());

  const login = async (email: string, password: string) => {
    const res = await api<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    console.log("LOGIN RESPONSE", res);

    // GUARDAR TOKEN
    tokenStorage.set(res.access_token);

    // GUARDAR USUARIO
    tokenStorage.setUser(res.user);

    setUser(res.user);
  };

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}