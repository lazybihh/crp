import API_URL from "./api";

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");
export const studyResourceFileUrl = (value) => value && value.startsWith("/uploads/") ? `${SERVER_URL}${value}` : value || "";

async function request(path, options, fallback) {
  const response = await fetch(`${API_URL}/study-resources${path}`, options);
  if (!response.ok) {
    let message = fallback;
    try { message = (await response.json()).message || fallback; } catch {}
    throw new Error(message);
  }
  return response.json();
}
const json = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
export const getStudyResources = (slug) => request(`/${encodeURIComponent(slug)}`, { cache: "no-store" }, "Could not load study resources");
export const getAllStudyResources = () => request("", { cache: "no-store" }, "Could not load study resources");
export const saveStudyResources = (slug, data) => request(`/${encodeURIComponent(slug)}`, json("PUT", data), "Could not save study resources");
export const resetStudyResources = (slug) => request(`/${encodeURIComponent(slug)}/reset`, { method: "POST" }, "Could not reset study resources");
export const uploadStudyResourceFile = async (file) => {
  if (!file) throw new Error("Choose a file first.");
  const form = new FormData();
  form.append("file", file);
  const result = await request("/upload", { method: "POST", body: form }, "File upload failed");
  return result.fileUrl;
};
