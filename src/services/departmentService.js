// departmentService.js - loads and saves the department pages (Faculty > Departments) through the backend.
import API_URL from "./api";

// images: same upload helper as the Home and Facilities editors
export { mediaUrl, uploadHomeImage as uploadDepartmentImage } from "./homeService";

async function request(url, options, failMessage) {
  const response = await fetch(`${API_URL}${url}`, options);
  if (!response.ok) {
    let message = failMessage;
    try {
      message = (await response.json()).message || failMessage; // the server explains what is wrong (for example an empty title)
    } catch {
      /* keep the short message */
    }
    throw new Error(message);
  }
  return response.json();
}

const json = (method, data) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

// all 9 departments, in order
export const getDepartments = () => request("/departments", undefined, "Cannot reach the server. Start the backend, then reload this page.");

// one department (for the public department pages)
export const getDepartment = (slug) => request(`/departments/${slug}`, undefined, "Failed to load the department");

// save one department; returns the saved department
export const saveDepartment = (slug, data) => request(`/departments/${slug}`, json("PUT", data), "Failed to save the department");

// go back to the starting content of one department; returns it
export const resetDepartment = (slug) => request(`/departments/${slug}/reset`, { method: "POST" }, "Failed to restore the department");