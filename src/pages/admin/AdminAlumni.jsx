import AdminSidebar from "./AdminSidebar";
import "./AdminAlumni.css";

export default function AdminAlumni() {
  return (
    <AdminSidebar title="Alumni">
      <section className="aag-page" aria-labelledby="aag-heading">
        <h2 id="aag-heading">Alumni</h2>
        <div className="aag-card">
          <p>Editor coming soon.</p>
          <a className="aag-link" href="/about/alumni" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
