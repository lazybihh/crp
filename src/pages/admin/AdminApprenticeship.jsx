import AdminSidebar from "./AdminSidebar";
import "./AdminApprenticeship.css";

export default function AdminApprenticeship() {
  return (
    <AdminSidebar title="Apprenticeship">
      <section className="abc-page" aria-labelledby="abc-heading">
        <h2 id="abc-heading">Apprenticeship</h2>
        <div className="abc-card">
          <p>Editor coming soon.</p>
          <a className="abc-link" href="/students/apprenticeship" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
