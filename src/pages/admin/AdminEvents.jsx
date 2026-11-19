import AdminSidebar from "./AdminSidebar";
import "./AdminEvents.css";

export default function AdminEvents() {
  return (
    <AdminSidebar title="Events">
      <section className="aac-page" aria-labelledby="aac-heading">
        <h2 id="aac-heading">Events</h2>
        <div className="aac-card">
          <p>Editor coming soon.</p>
          <a className="aac-link" href="/events" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
