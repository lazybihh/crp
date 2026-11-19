import AdminSidebar from "./AdminSidebar";
import "./AdminIncubator.css";

export default function AdminIncubator() {
  return (
    <AdminSidebar title="Incubator">
      <section className="abb-page" aria-labelledby="abb-heading">
        <h2 id="abb-heading">Incubator</h2>
        <div className="abb-card">
          <p>Editor coming soon.</p>
          <a className="abb-link" href="/students/incubator" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
