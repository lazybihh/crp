import API_URL from "./api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!response.ok) { const error = await response.json().catch(() => ({})); throw new Error(error.message || "Faculty content request failed"); }
  return response.json();
}
export const getPolicy = (key) => request(`/faculty/policies/${key}`);
export const savePolicy = (key, content) => request(`/faculty/policies/${key}`, { method: "PUT", body: JSON.stringify({ content }) });
export const getService = (key) => request(`/faculty/services/${key}`);
export const saveService = (key, content) => request(`/faculty/services/${key}`, { method: "PUT", body: JSON.stringify({ content }) });
