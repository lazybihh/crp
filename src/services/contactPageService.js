import API_URL from "./api";

async function request(url, options, failMessage) {
  const response = await fetch(`${API_URL}${url}`, options);
  if (!response.ok) {
    let message = failMessage;
    try { message = (await response.json()).message || failMessage; } catch { /* keep fallback */ }
    throw new Error(message);
  }
  return response.json();
}

export const getContactPage = () =>
  request("/contact-page", undefined, "Failed to load the Contact page");

export const saveContactPage = (data) =>
  request("/contact-page", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }, "Failed to save the Contact page");

export const saveContactBanner = (image) =>
  request("/contact-page/banner", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  }, "Failed to save the Contact banner");
