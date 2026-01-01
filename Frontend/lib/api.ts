const API_BASE_URL = "http://localhost:8000";

export async function apiRequest(
  endpoint: string,
  method: string,
  body?: any,
  token?: string
) {
  const headers: any = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
}
