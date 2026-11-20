import API_URL from "./api";
import { mediaUrl } from "./homeService";
const LEGACY_NOTICE_FOLDER = "/docs/notices/";

async function request(path, options, fallback) {
  const response = await fetch(`${API_URL}/notices${path}`, options);
  if (!response.ok) { let message = fallback; try { message = (await response.json()).message || fallback; } catch {} throw new Error(message); }
  return response.json();
}
const json = (method, data) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const getNotices = () => request("", { cache: "no-store" }, "Could not load notices");
export const getAllNotices = () => request("/all", undefined, "Could not load notices");
export const createNotice = (data) => request("", json("POST", data), "Could not create notice");
export const updateNotice = (id, data) => request(`/${id}`, json("PUT", data), "Could not update notice");
export const removeNotice = (id) => request(`/${id}`, { method: "DELETE" }, "Could not delete notice");
export const getNoticePage = () => request("/page", undefined, "Could not load Notices page settings");
export const saveNoticePage = (data) => request("/page", json("PUT", data), "Could not save Notices page settings");
export const uploadNoticeFile = async (file) => { const body = new FormData(); body.append("file", file); const data = await request("/upload", { method: "POST", body }, "File upload failed"); return data.fileUrl; };

export const noticeFileUrl = (file) => {
  const value = String(file || "").trim().replace(/\\/g, "/");
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/uploads/")) return mediaUrl(value);
  if (value.startsWith("/docs/notices/")) return value;
  if (value.startsWith("docs/notices/")) return `/${value}`;
  return `${LEGACY_NOTICE_FOLDER}${value.replace(/^\/+/, "")}`;
};

export { mediaUrl };
