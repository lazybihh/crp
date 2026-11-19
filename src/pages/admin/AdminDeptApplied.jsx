import AdminSidebar from "./AdminSidebar";
import "./AdminDeptApplied.css";

export default function AdminDeptApplied() {
  return (
    <AdminSidebar title="Applied Sciences">
      <section className="abr-page" aria-labelledby="abr-heading">
        <h2 id="abr-heading">Applied Sciences</h2>
        <div className="abr-card">
          <p>Editor coming soon.</p>
          <a className="abr-link" href="/departments/applied-science" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
