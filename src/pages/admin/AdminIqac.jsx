import AdminSidebar from "./AdminSidebar";
import "./AdminIqac.css";

export default function AdminIqac() {
  return (
    <AdminSidebar title="IQAC">
      <section className="aby-page" aria-labelledby="aby-heading">
        <h2 id="aby-heading">IQAC</h2>
        <div className="aby-card">
          <p>Editor coming soon.</p>
          <a className="aby-link" href="/faculty/iqac" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
