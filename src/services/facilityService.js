import API_URL from "./api";

// "/uploads/x.jpg" -> full address on the server; "/images/x.jpg" (website folder) stays as it is. Same helpers as the Home page.
export { mediaUrl, uploadHomeImage as uploadFacilityImage } from "./homeService";

async function request(url, options, failMessage) {
  const response = await fetch(`${API_URL}${url}`, options);
  if (!response.ok) {
    let message = failMessage;
    try {
      message = (await response.json()).message || failMessage; // the server explains what is wrong (for example an empty tab name)
    } catch {
      /* keep the short message */
    }
    throw new Error(message);
  }
  return response.json();
}

const json = (method, data) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

// The Facilities page: { page: {texts}, facilities: [...] }
export const getFacilities = () => request("/facilities", undefined, "Failed to load the Facilities page");

// Save the page-level text (title block, number cards, headings, labels)
export const saveFacilitiesPage = (data) => request("/facilities/page", json("PUT", data), "Failed to save the page text");

export const saveFacilitiesBanner = (image) =>
  request("/facilities/page/banner", json("PUT", { image }), "Failed to save the Facilities banner");

// Edit one facility (text + its 3 photo slots)
export const saveFacility = (id, data) => request(`/facilities/${id}`, json("PUT", data), "Failed to save the facility");

// Delete one facility
export const deleteFacility = (id) => request(`/facilities/${id}`, { method: "DELETE" }, "Failed to delete the facility");
