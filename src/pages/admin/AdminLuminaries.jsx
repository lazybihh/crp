import AdminSidebar from "./AdminSidebar";
import "./AdminLuminaries.css";

export default function AdminLuminaries() {
  return (
    <AdminSidebar title="Luminaries">
      <section className="aan-page" aria-labelledby="aan-heading">
        <h2 id="aan-heading">Luminaries</h2>
        <div className="aan-card">
          <p>Editor coming soon.</p>
          <a className="aan-link" href="/about/luminaries" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
