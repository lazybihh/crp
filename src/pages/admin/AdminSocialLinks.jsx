import AdminSidebar from "./AdminSidebar";
import "./AdminSocialLinks.css";

export default function AdminSocialLinks() {
  return (
    <AdminSidebar title="Social links">
      <section className="acc-page" aria-labelledby="acc-heading">
        <h2 id="acc-heading">Social links</h2>
        <div className="acc-card">
          <p>Editor coming soon.</p>
          <a className="acc-link" href="/media/social" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
