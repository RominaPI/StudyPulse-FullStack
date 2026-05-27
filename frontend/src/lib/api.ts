const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token
          ? `Bearer ${token}`
          : "",
        ...(options.headers || {}),
      },
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