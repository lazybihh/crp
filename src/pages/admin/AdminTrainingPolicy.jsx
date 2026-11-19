import AdminSidebar from "./AdminSidebar";
import "./AdminTrainingPolicy.css";

export default function AdminTrainingPolicy() {
  return (
    <AdminSidebar title="Training policy">
      <section className="abu-page" aria-labelledby="abu-heading">
        <h2 id="abu-heading">Training policy</h2>
        <div className="abu-card">
          <p>Editor coming soon.</p>
          <a className="abu-link" href="/faculty/training-policy" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
