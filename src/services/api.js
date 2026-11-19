// The backend address. Set VITE_API_URL in the .env file that sits NEXT TO package.json (not inside src), then restart `npm run dev`.
// If it is missing, the local backend is used.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default API_URL;