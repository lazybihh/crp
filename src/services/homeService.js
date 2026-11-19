import API_URL from "./api";

// the server's address without "/api" (uploaded images live at SERVER_URL/uploads/...)
const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

// "/uploads/x.jpg" -> full address on the server; "/images/x.jpg" (website folder) stays as it is
export const mediaUrl = (path) => (path && path.startsWith("/uploads/") ? `${SERVER_URL}${path}` : path || "");

async function request(url, options, failMessage) {
  const response = await fetch(`${API_URL}${url}`, options);
  if (!response.ok) throw new Error(failMessage);
  return response.json();
}

// Home page content (saved fields + ready lists: notices, facilityTiles)
export const getHomeContent = () => request("/home", undefined, "Failed to load Home Page content");

// Notices and facilities the admin can choose from
export const getHomeOptions = () => request("/home/options", undefined, "Failed to load the notices and facilities");

// Save the whole Home page
export const saveHomeContent = (data) =>
  request("/home", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }, "Failed to save Home Page content");

// Upload one image, returns "/uploads/xxx.jpg"
export const uploadHomeImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const data = await request("/uploads", { method: "POST", body: formData }, "Image upload failed");
  return data.imageUrl;
};