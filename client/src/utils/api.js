const apiBase = import.meta.env.VITE_API_URL || "/api";

export const sessionId = globalThis.crypto?.randomUUID?.() || `session-${Date.now()}`;

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The server request failed.");
  return data;
}
