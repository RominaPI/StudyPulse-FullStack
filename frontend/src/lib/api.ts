const BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000/api/v1";

const TOKEN_KEY = "sp_token";
const USER_KEY = "sp_user";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),

  set: (t: string) =>
    localStorage.setItem(TOKEN_KEY, t),

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setUser: (u: unknown) =>
    localStorage.setItem(USER_KEY, JSON.stringify(u)),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export async function api<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {

  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",

    ...(init.headers as
      | Record<string, string>
      | undefined),
  };

  // IMPORTANTE
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    `${BASE_URL}${path}`,
    {
      ...init,
      headers,
    }
  );

  const text = await res.text();

  const data = text
    ? safeJson(text)
    : null;

  if (!res.ok) {

    // si el token expiró
    if (res.status === 401) {
      tokenStorage.clear();
    }

    const msg =
      (data &&
        (data.message || data.error)) ||
      `Error ${res.status}`;

    throw new Error(
      Array.isArray(msg)
        ? msg.join(", ")
        : String(msg)
    );
  }

  return data as T;
}

function safeJson(t: string) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}

export const API_BASE_URL = BASE_URL;