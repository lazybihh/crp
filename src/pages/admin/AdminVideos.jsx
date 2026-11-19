import AdminSidebar from "./AdminSidebar";
import "./AdminVideos.css";

export default function AdminVideos() {
  return (
    <AdminSidebar title="Videos">
      <section className="acb-page" aria-labelledby="acb-heading">
        <h2 id="acb-heading">Videos</h2>
        <div className="acb-card">
          <p>Editor coming soon.</p>
          <a className="acb-link" href="/media/videos" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
