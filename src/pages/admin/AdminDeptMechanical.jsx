import AdminSidebar from "./AdminSidebar";
import "./AdminDeptMechanical.css";

export default function AdminDeptMechanical() {
  return (
    <AdminSidebar title="Mechanical Engineering">
      <section className="abp-page" aria-labelledby="abp-heading">
        <h2 id="abp-heading">Mechanical Engineering</h2>
        <div className="abp-card">
          <p>Editor coming soon.</p>
          <a className="abp-link" href="/departments/mechanical" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
