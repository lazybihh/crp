import AdminSidebar from "./AdminSidebar";
import "./AdminDeptElectrical.css";

export default function AdminDeptElectrical() {
  return (
    <AdminSidebar title="Electrical Engineering">
      <section className="abn-page" aria-labelledby="abn-heading">
        <h2 id="abn-heading">Electrical Engineering</h2>
        <div className="abn-card">
          <p>Editor coming soon.</p>
          <a className="abn-link" href="/departments/electrical" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
