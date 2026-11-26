// authService.js - admin login. The token is kept in this browser only.
// installAuthFetch() adds the token to every request that goes to the backend, so the admin pages need no changes.
import API_URL from "./api";

const KEY = "admin-token";

export const getToken = () => { try { return localStorage.getItem(KEY) || ""; } catch { return ""; } };
export const setToken = (token) => { try { token ? localStorage.setItem(KEY, token) : localStorage.removeItem(KEY); } catch { /* private window: login lasts until reload */ } };
export const isLoggedIn = () => Boolean(getToken());

export async function login(username, password) {
  let response;
  try {
    response = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
  } catch {
    throw new Error("Could not reach the server. Is the backend running?");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Login failed");
  setToken(data.token);
}

export function logout() {
  setToken("");
  window.location.assign("/admin/login");
}

// Is the saved token still accepted by the server? (false = log in again; true when the server cannot be reached)
export async function checkLogin() {
  const token = getToken();
  if (!token) return false;
  try {
    const response = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status === 401) { setToken(""); return false; }
    return true;
  } catch {
    return true;
  }
}

let installed = false;
export function installAuthFetch() {
  if (installed) return;
  installed = true;
  const original = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    if (!url.startsWith(API_URL) || url.startsWith(`${API_URL}/auth/login`)) return original(input, init);
    const token = getToken();
    const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
    if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
    const response = await original(input, { ...init, headers });
    if (response.status === 401 && token && window.location.pathname.startsWith("/admin") && !window.location.pathname.startsWith("/admin/login")) {
      setToken("");
      window.location.assign("/admin/login");
    }
    return response;
  };
}
