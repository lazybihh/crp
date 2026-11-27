import API_URL from "./api";

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");
export const mediaUrl = (value) => value && value.startsWith("/uploads/") ? `${SERVER_URL}${value}` : value || "";

async function request(path, options, fallback) {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    let message = fallback;
    try { message = (await response.json()).message || fallback; } catch { /* keep fallback */ }
    throw new Error(message);
  }
  return response.json();
}

const json = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const getMedia = () => request("/media", undefined, "Failed to load media content.");
export const savePhotos = (photos) => request("/media/photos", json("PUT", { photos }), "Failed to save photos.");
export const addPhotoCategory = (name) => request("/media/photo-categories", json("POST", { name }), "Failed to add photo category.");
export const renamePhotoCategory = (category, name) => request(`/media/photo-categories/${encodeURIComponent(category)}`, json("PATCH", { name }), "Failed to rename photo category.");
export const deletePhotoCategory = (category) => request(`/media/photo-categories/${encodeURIComponent(category)}`, { method: "DELETE" }, "Failed to delete photo category.");
export const saveVideos = (videos) => request("/media/videos", json("PUT", { videos }), "Failed to save video links.");
export const saveSocialLinks = (socialLinks) => request("/media/social-links", json("PUT", { socialLinks }), "Failed to save social links.");
export const savePageBanner = (page, src) => request(`/media/banners/${encodeURIComponent(page)}`, json("PUT", { src }), "Failed to save page banner.");

// Images are uploaded through the existing shared image endpoint. Video files are never uploaded.
export const uploadMediaImage = async (file) => {
  if (!file?.type?.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose an image smaller than 5 MB.");
  const form = new FormData();
  form.append("image", file);
  const result = await request("/uploads", { method: "POST", body: form }, "Image upload failed.");
  return result.imageUrl;
};

export function getVideoEmbedUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    let id = "";
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      id = url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || "";
    }
    if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    if (host === "vimeo.com") {
      const vimeoId = url.pathname.split("/").filter(Boolean).reverse().find((part) => /^\d+$/.test(part)) || "";
      return vimeoId ? `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}?autoplay=1` : "";
    }
    if (host === "player.vimeo.com" && url.pathname.includes("/video/")) return `${url.origin}${url.pathname}?autoplay=1`;
    return "";
  } catch {
    return "";
  }
}
