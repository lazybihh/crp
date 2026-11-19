import AdminSidebar from "./AdminSidebar";
import "./AdminPlacements.css";

export default function AdminPlacements() {
  return (
    <AdminSidebar title="Placements">
      <section className="aaj-page" aria-labelledby="aaj-heading">
        <h2 id="aaj-heading">Placements</h2>
        <div className="aaj-card">
          <p>Editor coming soon.</p>
          <a className="aaj-link" href="/about/placements" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
