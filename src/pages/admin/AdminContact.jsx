import AdminSidebar from "./AdminSidebar";
import "./AdminContact.css";

export default function AdminContact() {
  return (
    <AdminSidebar title="Contact us">
      <section className="aas-page" aria-labelledby="aas-heading">
        <h2 id="aas-heading">Contact us</h2>
        <div className="aas-card">
          <p>Editor coming soon.</p>
          <a className="aas-link" href="/about/contact" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
