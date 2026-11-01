export const apiBase = import.meta.env.VITE_API_URL || "/api";

export const sessionId = globalThis.crypto?.randomUUID?.() || `session-${Date.now()}`;

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const token = localStorage.getItem("deviltutorToken");
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (response.status === 401) window.dispatchEvent(new Event("deviltutor:unauthorized"));
  if (!response.ok) throw new Error(data.message || data.error || "The server request failed.");
  return data;
}
