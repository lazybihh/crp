import API_URL from "./api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
  } catch (error) {
    throw new Error(`Unable to connect to the server. ${error.message || "Check that the backend is running."}`);
  }

  const raw = await response.text();
  let data = {};
  if (raw) {
    try { data = JSON.parse(raw); }
    catch { data = { message: raw }; }
  }
  if (!response.ok) {
    throw new Error(data.message || `Faculty content request failed (${response.status}).`);
  }
  return data;
}

export const getPolicy = (key) => request(`/faculty/policies/${encodeURIComponent(key)}`);
export const savePolicy = (key, content) => request(`/faculty/policies/${encodeURIComponent(key)}`, {
  method: "PUT", body: JSON.stringify({ content }),
});
export const getService = (key) => request(`/faculty/services/${encodeURIComponent(key)}`);
export const saveService = (key, content) => request(`/faculty/services/${encodeURIComponent(key)}`, {
  method: "PUT", body: JSON.stringify({ content }),
});
