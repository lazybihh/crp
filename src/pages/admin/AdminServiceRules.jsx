import AdminSidebar from "./AdminSidebar";
import "./AdminServiceRules.css";

export default function AdminServiceRules() {
  return (
    <AdminSidebar title="Service rules">
      <section className="abx-page" aria-labelledby="abx-heading">
        <h2 id="abx-heading">Service rules</h2>
        <div className="abx-card">
          <p>Editor coming soon.</p>
          <a className="abx-link" href="/faculty/service-rules" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
