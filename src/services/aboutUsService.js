import API_URL from "./api";
import { usePageReady } from "../components/PageLoader";

const groupFor = {
  history: "institute", "principal-message": "institute", "rank-accreditation": "institute", alumni: "institute",
  courses: "academics", results: "academics", placements: "academics", entrepreneurship: "academics", "annual-report": "academics",
  luminaries: "achievements", projects: "achievements", extracurricular: "achievements", "unnat-bharat-abhiyan": "achievements",
};

async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${API_URL}${path}`, options); }
  catch (error) { throw new Error(`Unable to connect to the server. ${error.message || "Check that the backend is running."}`); }
  const raw = await response.text();
  let data = {};
  if (raw) { try { data = JSON.parse(raw); } catch { data = { message: raw }; } }
  if (!response.ok) throw new Error(data.message || `About Us request failed (${response.status}).`);
  return data;
}

export function mergeAboutContent(defaultValue, savedValue) {
  if (savedValue === undefined || savedValue === null) return defaultValue;
  if (Array.isArray(defaultValue) && Array.isArray(savedValue)) {
    return defaultValue.map((item, index) => index < savedValue.length ? mergeAboutContent(item, savedValue[index]) : item);
  }
  if (defaultValue && savedValue && typeof defaultValue === "object" && typeof savedValue === "object" && !Array.isArray(defaultValue) && !Array.isArray(savedValue)) {
    const result = { ...defaultValue };
    Object.keys(savedValue).forEach((key) => { result[key] = key in defaultValue ? mergeAboutContent(defaultValue[key], savedValue[key]) : savedValue[key]; });
    return result;
  }
  return savedValue;
}

export async function getAboutPage(key) {
  const group = groupFor[key];
  if (!group) throw new Error(`Unknown About Us page: ${key}`);
  return request(`/about-us/${group}/${encodeURIComponent(key)}`);
}

export async function saveAboutPage(key, content) {
  const group = groupFor[key];
  if (!group) throw new Error(`Unknown About Us page: ${key}`);
  return request(`/about-us/${group}/${encodeURIComponent(key)}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }),
  });
}

// The page waits (with the loader) until the server answers, so the built-in content never flashes before the saved content.
// If the server is down or too slow, content stays null and the page shows its built-in content.
export function useAboutPage(key) {
  const { ready, data } = usePageReady(() => getAboutPage(key).then((row) => row.content || row));
  return { ready, content: data };
}
