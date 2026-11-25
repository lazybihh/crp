// studentPageService.js - loads and saves the content of the Students pages (Support and Careers groups).
// The 11 page keys are listed in `groupFor`; each key lives in one backend group.
import API_URL from "./api";
import { usePageReady } from "../components/PageLoader";

const groupFor = {
  admissions: "support",
  "academic-calendar": "support",
  "online-learning": "support",
  helpline: "support",
  grievance: "support",
  "e-services": "support",
  "skill-courses": "careers",
  freelancing: "careers",
  incubator: "careers",
  apprenticeship: "careers",
  "ncc-nss": "careers",
};

// One request to the backend. Returns the JSON, or throws an Error with the server's message.
async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { message: raw };
  }
  if (!response.ok) throw new Error(data.message || `Students request failed (${response.status})`);
  return data;
}

function pagePath(key) {
  const group = groupFor[key];
  if (!group) throw new Error("Unknown Students page");
  return `/students/${group}/${encodeURIComponent(key)}`;
}

export const getStudentPage = (key) => request(pagePath(key));

export const saveStudentPage = (key, content) =>
  request(pagePath(key), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

// Uploads one document (PDF, Word, Excel, PowerPoint or image). The answer holds `fileUrl`.
export const uploadStudentDocument = async (file) => {
  const body = new FormData();
  body.append("document", file);
  return request("/uploads/document", { method: "POST", body });
};

// Saved content wins over the defaults. Objects are merged key by key; a saved list replaces the default list.
export function mergeStudentContent(defaultValue, savedValue) {
  if (savedValue == null) return defaultValue;
  if (Array.isArray(defaultValue) && Array.isArray(savedValue)) return mergeStudentList(defaultValue, savedValue);
  const bothObjects =
    defaultValue && savedValue &&
    typeof defaultValue === "object" && typeof savedValue === "object" &&
    !Array.isArray(defaultValue) && !Array.isArray(savedValue);
  if (bothObjects) {
    const result = { ...defaultValue };
    Object.keys(savedValue).forEach((key) => {
      result[key] = key in defaultValue ? mergeStudentContent(defaultValue[key], savedValue[key]) : savedValue[key];
    });
    return result;
  }
  return savedValue;
}

// A saved list replaces the default list. Icons and ids are not saved in the database, so each saved item
// takes them from the default item at the same position. An item added in the admin has no default item,
// so it gets the first icon of the default list.
export function mergeStudentList(defaultValue, savedValue) {
  if (!Array.isArray(savedValue)) return defaultValue;
  const listIcon = defaultValue.find((item) => item && item.icon)?.icon;
  return savedValue.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return item;
    const original = defaultValue[index] && typeof defaultValue[index] === "object" ? defaultValue[index] : {};
    const restored = {};
    const icon = original.icon || listIcon;
    if (icon) restored.icon = icon;
    if (original.id !== undefined) restored.id = original.id;
    return { ...restored, ...item };
  });
}

// Loads one page (and, optionally, one extra request such as the notices). `ready` turns true when loading is done or has timed out.
export function useStudentPage(key, extraLoader) {
  const { ready, data } = usePageReady(async () => {
    const results = await Promise.allSettled([getStudentPage(key), extraLoader ? extraLoader() : Promise.resolve(null)]);
    const row = results[0].status === "fulfilled" ? results[0].value : null;
    const extra = results[1].status === "fulfilled" ? results[1].value : null;
    return { content: row?.content || row, extra };
  });
  return { ready, content: data?.content ?? null, extra: data?.extra ?? null };
}
