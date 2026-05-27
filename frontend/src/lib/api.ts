const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.error ||
      error.message ||
      "Request failed"
    );
  }

  return response.json();
}