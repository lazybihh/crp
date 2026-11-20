import API_URL from "./api";
export { mediaUrl, uploadHomeImage } from "./homeService";

async function request(url, options, failMessage) {
  const response = await fetch(`${API_URL}${url}`, options);
  if (!response.ok) {
    let message = failMessage;
    try { message = (await response.json()).message || failMessage; } catch { /* keep fallback */ }
    throw new Error(message);
  }
  return response.json();
}

export const getSiteSettings = () => request("/settings", undefined, "Failed to load site settings");
export const saveSiteSettings = (data) =>
  request("/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }, "Failed to save site settings");
