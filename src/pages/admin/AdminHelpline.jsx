import AdminSidebar from "./AdminSidebar";
import "./AdminHelpline.css";

export default function AdminHelpline() {
  return (
    <AdminSidebar title="Student helpline">
      <section className="aaw-page" aria-labelledby="aaw-heading">
        <h2 id="aaw-heading">Student helpline</h2>
        <div className="aaw-card">
          <p>Editor coming soon.</p>
          <a className="aaw-link" href="/students/helpline" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
