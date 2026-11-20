import API_URL from "./api";

async function request(url, options, failMessage) {
  const response = await fetch(`${API_URL}${url}`, options);
  if (!response.ok) {
    let message = failMessage;
    try { message = (await response.json()).message || failMessage; } catch { /* keep fallback */ }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

const json = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const sendEnquiry = (data) =>
  request("/enquiries", json("POST", data), "Failed to send enquiry");

export const getEnquiries = () =>
  request("/enquiries", undefined, "Failed to load enquiries");

export const setEnquiryStatus = (id, status) =>
  request(`/enquiries/${id}`, json("PUT", { status }), "Failed to update the enquiry");

export const deleteEnquiry = (id) =>
  request(`/enquiries/${id}`, { method: "DELETE" }, "Failed to delete the enquiry");

export const getEnquiryStats = async () => {
  const items = await getEnquiries();
  return {
    total: items.length,
    fresh: items.filter((item) => item.status === "new").length,
  };
};
