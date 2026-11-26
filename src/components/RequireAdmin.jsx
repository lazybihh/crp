// RequireAdmin.jsx - shows the admin pages only to a logged-in admin; otherwise goes to the login page.
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkLogin, isLoggedIn } from "../services/authService";

export default function RequireAdmin({ children }) {
  const [state, setState] = useState(isLoggedIn() ? "checking" : "out");

  useEffect(() => {
    if (!isLoggedIn()) return;
    let alive = true;
    checkLogin().then((ok) => alive && setState(ok ? "in" : "out"));
    return () => { alive = false; };
  }, []);

  if (state === "out") return <Navigate to="/admin/login" replace />;
  if (state === "checking") return null;
  return children;
}
