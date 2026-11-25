import AdminSidebar from "./AdminSidebar";
import "./AdminDeptWorkshop.css";

export default function AdminDeptWorkshop() {
  return (
    <AdminSidebar title="Workshop">
      <section className="abs-page" aria-labelledby="abs-heading">
        <h2 id="abs-heading">Workshop</h2>
        <div className="abs-card">
          <p>Editor coming soon.</p>
          <a className="abs-link" href="/departments/workshop" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
