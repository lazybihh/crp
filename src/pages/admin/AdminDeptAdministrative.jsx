import AdminSidebar from "./AdminSidebar";
import "./AdminDeptAdministrative.css";

export default function AdminDeptAdministrative() {
  return (
    <AdminSidebar title="Administrative">
      <section className="abt-page" aria-labelledby="abt-heading">
        <h2 id="abt-heading">Administrative</h2>
        <div className="abt-card">
          <p>Editor coming soon.</p>
          <a className="abt-link" href="/departments/administrative" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
