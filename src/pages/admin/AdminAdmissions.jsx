import AdminSidebar from "./AdminSidebar";
import "./AdminAdmissions.css";

export default function AdminAdmissions() {
  return (
    <AdminSidebar title="Admissions">
      <section className="aat-page" aria-labelledby="aat-heading">
        <h2 id="aat-heading">Admissions</h2>
        <div className="aat-card">
          <p>Editor coming soon.</p>
          <a className="aat-link" href="/students/admissions" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
