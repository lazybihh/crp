import AdminSidebar from "./AdminSidebar";
import "./AdminResourcesComputer.css";

export default function AdminResourcesComputer() {
  return (
    <AdminSidebar title="Computer study resources">
      <section className="abg-page" aria-labelledby="abg-heading">
        <h2 id="abg-heading">Computer study resources</h2>
        <div className="abg-card">
          <p>Editor coming soon.</p>
          <a className="abg-link" href="/students/departments/computer" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
