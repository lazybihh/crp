import AdminSidebar from "./AdminSidebar";
import "./AdminMandatoryDisclosure.css";

export default function AdminMandatoryDisclosure() {
  return (
    <AdminSidebar title="Mandatory disclosure">
      <section className="aam-page" aria-labelledby="aam-heading">
        <h2 id="aam-heading">Mandatory disclosure</h2>
        <div className="aam-card">
          <p>Editor coming soon.</p>
          <a className="aam-link" href="/about/mandatory-disclosure" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
