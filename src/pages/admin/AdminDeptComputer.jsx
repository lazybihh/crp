import AdminSidebar from "./AdminSidebar";
import "./AdminDeptComputer.css";

export default function AdminDeptComputer() {
  return (
    <AdminSidebar title="Computer Engineering">
      <section className="abm-page" aria-labelledby="abm-heading">
        <h2 id="abm-heading">Computer Engineering</h2>
        <div className="abm-card">
          <p>Editor coming soon.</p>
          <a className="abm-link" href="/departments/computer" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
