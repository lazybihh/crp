import AdminSidebar from "./AdminSidebar";
import "./AdminExtracurricular.css";

export default function AdminExtracurricular() {
  return (
    <AdminSidebar title="Extracurricular achievements">
      <section className="aap-page" aria-labelledby="aap-heading">
        <h2 id="aap-heading">Extracurricular achievements</h2>
        <div className="aap-card">
          <p>Editor coming soon.</p>
          <a className="aap-link" href="/about/extracurricular" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
