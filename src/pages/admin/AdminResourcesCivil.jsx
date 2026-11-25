import AdminSidebar from "./AdminSidebar";
import "./AdminResourcesCivil.css";

export default function AdminResourcesCivil() {
  return (
    <AdminSidebar title="Civil study resources">
      <section className="abf-page" aria-labelledby="abf-heading">
        <h2 id="abf-heading">Civil study resources</h2>
        <div className="abf-card">
          <p>Editor coming soon.</p>
          <a className="abf-link" href="/students/departments/civil" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
