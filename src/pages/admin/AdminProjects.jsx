import AdminSidebar from "./AdminSidebar";
import "./AdminProjects.css";

export default function AdminProjects() {
  return (
    <AdminSidebar title="Projects">
      <section className="aao-page" aria-labelledby="aao-heading">
        <h2 id="aao-heading">Projects</h2>
        <div className="aao-card">
          <p>Editor coming soon.</p>
          <a className="aao-link" href="/about/projects" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
