import AdminSidebar from "./AdminSidebar";
import "./AdminResults.css";

export default function AdminResults() {
  return (
    <AdminSidebar title="Results">
      <section className="aai-page" aria-labelledby="aai-heading">
        <h2 id="aai-heading">Results</h2>
        <div className="aai-card">
          <p>Editor coming soon.</p>
          <a className="aai-link" href="/about/results" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
