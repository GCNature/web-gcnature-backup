import { API_BASE_URL } from "@/lib/config";

// API configuration and helpers for communicating with the backend
export const API_BASE = API_BASE_URL;

function getToken(): string | null {
  return localStorage.getItem("token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Lỗi server" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function apiPost<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Lỗi server" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function apiPut<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Lỗi server" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function apiPatch<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Lỗi server" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function apiDelete<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Lỗi server" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}
