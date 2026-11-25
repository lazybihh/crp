import AdminSidebar from "./AdminSidebar";
import "./AdminDeptElectronics.css";

export default function AdminDeptElectronics() {
  return (
    <AdminSidebar title="Electronics & Communication">
      <section className="abo-page" aria-labelledby="abo-heading">
        <h2 id="abo-heading">Electronics & Communication</h2>
        <div className="abo-card">
          <p>Editor coming soon.</p>
          <a className="abo-link" href="/departments/electronics" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
