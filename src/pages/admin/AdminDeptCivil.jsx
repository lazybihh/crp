import AdminSidebar from "./AdminSidebar";
import "./AdminDeptCivil.css";

export default function AdminDeptCivil() {
  return (
    <AdminSidebar title="Civil Engineering">
      <section className="abl-page" aria-labelledby="abl-heading">
        <h2 id="abl-heading">Civil Engineering</h2>
        <div className="abl-card">
          <p>Editor coming soon.</p>
          <a className="abl-link" href="/departments/civil" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
