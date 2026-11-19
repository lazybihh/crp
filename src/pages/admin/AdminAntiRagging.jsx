import AdminSidebar from "./AdminSidebar";
import "./AdminAntiRagging.css";

export default function AdminAntiRagging() {
  return (
    <AdminSidebar title="Anti ragging">
      <section className="abv-page" aria-labelledby="abv-heading">
        <h2 id="abv-heading">Anti ragging</h2>
        <div className="abv-card">
          <p>Editor coming soon.</p>
          <a className="abv-link" href="/faculty/anti-ragging" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
