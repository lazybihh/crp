// AdminLogin.jsx - /admin/login. Own styles (AdminLogin.css, every class starts with "alg-").
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiLock, FiUser } from "react-icons/fi";
import { isLoggedIn, login } from "../../services/authService";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isLoggedIn()) return <Navigate to="/admin" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(username.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="alg-page">
      <form className="alg-card" onSubmit={submit}>
        <img src="/logo.png" alt="" className="alg-logo" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        <h1>Admin login</h1>
        <p>Chhotu Ram Polytechnic website</p>
        <label>
          <span>Username</span>
          <div className="alg-field"><FiUser aria-hidden="true" /><input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus required /></div>
        </label>
        <label>
          <span>Password</span>
          <div className="alg-field"><FiLock aria-hidden="true" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></div>
        </label>
        {error && <p className="alg-error" role="alert">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? "Logging in..." : "Log in"}</button>
      </form>
    </main>
  );
}
