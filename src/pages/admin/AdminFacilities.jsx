import AdminSidebar from "./AdminSidebar";
import "./AdminFacilities.css";

export default function AdminFacilities() {
  return (
    <AdminSidebar title="Facilities">
      <section className="aar-page" aria-labelledby="aar-heading">
        <h2 id="aar-heading">Facilities</h2>
        <div className="aar-card">
          <p>Editor coming soon.</p>
          <a className="aar-link" href="/about/facilities" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
