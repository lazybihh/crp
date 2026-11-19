import AdminSidebar from "./AdminSidebar";
import "./AdminPhotos.css";

export default function AdminPhotos() {
  return (
    <AdminSidebar title="Photos">
      <section className="aca-page" aria-labelledby="aca-heading">
        <h2 id="aca-heading">Photos</h2>
        <div className="aca-card">
          <p>Editor coming soon.</p>
          <a className="aca-link" href="/media/photos" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
