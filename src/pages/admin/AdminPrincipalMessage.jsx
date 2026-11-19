import AdminSidebar from "./AdminSidebar";
import "./AdminPrincipalMessage.css";

export default function AdminPrincipalMessage() {
  return (
    <AdminSidebar title="Principal's desk">
      <section className="aae-page" aria-labelledby="aae-heading">
        <h2 id="aae-heading">Principal's desk</h2>
        <div className="aae-card">
          <p>Editor coming soon.</p>
          <a className="aae-link" href="/about/principal-message" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
