import AdminSidebar from "./AdminSidebar";
import "./AdminFreelancing.css";

export default function AdminFreelancing() {
  return (
    <AdminSidebar title="Freelancing">
      <section className="aba-page" aria-labelledby="aba-heading">
        <h2 id="aba-heading">Freelancing</h2>
        <div className="aba-card">
          <p>Editor coming soon.</p>
          <a className="aba-link" href="/students/freelancing" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
