import AdminSidebar from "./AdminSidebar";
import "./AdminNotices.css";

export default function AdminNotices() {
  return (
    <AdminSidebar title="Notices">
      <section className="aab-page" aria-labelledby="aab-heading">
        <h2 id="aab-heading">Notices</h2>
        <div className="aab-card">
          <p>Editor coming soon.</p>
          <a className="aab-link" href="/notices" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
