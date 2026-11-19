import AdminSidebar from "./AdminSidebar";
import "./AdminResourcesApplied.css";

export default function AdminResourcesApplied() {
  return (
    <AdminSidebar title="Applied Science study resources">
      <section className="abe-page" aria-labelledby="abe-heading">
        <h2 id="abe-heading">Applied Science study resources</h2>
        <div className="abe-card">
          <p>Editor coming soon.</p>
          <a className="abe-link" href="/students/departments/applied-science" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
