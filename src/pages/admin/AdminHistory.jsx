import AdminSidebar from "./AdminSidebar";
import "./AdminHistory.css";

export default function AdminHistory() {
  return (
    <AdminSidebar title="History">
      <section className="aad-page" aria-labelledby="aad-heading">
        <h2 id="aad-heading">History</h2>
        <div className="aad-card">
          <p>Editor coming soon.</p>
          <a className="aad-link" href="/about/history" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
