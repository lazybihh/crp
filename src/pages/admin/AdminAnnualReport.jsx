import AdminSidebar from "./AdminSidebar";
import "./AdminAnnualReport.css";

export default function AdminAnnualReport() {
  return (
    <AdminSidebar title="Annual report">
      <section className="aal-page" aria-labelledby="aal-heading">
        <h2 id="aal-heading">Annual report</h2>
        <div className="aal-card">
          <p>Editor coming soon.</p>
          <a className="aal-link" href="/about/annual-report" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
