import API_URL from "./api";

// "/uploads/x.jpg" -> full address on the server; "/images/x.jpg" (website folder) stays as it is. Same helpers as the Home page.
export { mediaUrl, uploadHomeImage as uploadEventImage } from "./homeService";

async function request(url, options, failMessage) {
  const response = await fetch(`${API_URL}${url}`, options);
  if (!response.ok) {
    let message = failMessage;
    try {
      message = (await response.json()).message || failMessage; // the server explains what is wrong (for example a missing title)
    } catch {
      /* keep the short message */
    }
    throw new Error(message);
  }
  return response.json();
}

const json = (method, data) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

// Events for visitors (published only): { events: [...] } already in page order
export const getEvents = () => request("/events", undefined, "Failed to load the events");

// Events for the admin editor (hidden ones too)
export const getAllEvents = () => request("/events/all", undefined, "Failed to load the events");

export const getEventsBanner = () => request("/events/page/banner", undefined, "Failed to load the Events banner");

export const saveEventsBanner = (image) =>
  request("/events/page/banner", json("PUT", { image }), "Failed to save the Events banner");

// Add one event -> { event }
export const createEvent = (data) => request("/events", json("POST", data), "Failed to add the event");

// Edit one event -> { event }
export const saveEvent = (id, data) => request(`/events/${id}`, json("PUT", data), "Failed to save the event");

// Delete one event
export const deleteEvent = (id) => request(`/events/${id}`, { method: "DELETE" }, "Failed to delete the event");
