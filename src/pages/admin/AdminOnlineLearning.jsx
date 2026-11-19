import AdminSidebar from "./AdminSidebar";
import "./AdminOnlineLearning.css";

export default function AdminOnlineLearning() {
  return (
    <AdminSidebar title="Online learning portals">
      <section className="aav-page" aria-labelledby="aav-heading">
        <h2 id="aav-heading">Online learning portals</h2>
        <div className="aav-card">
          <p>Editor coming soon.</p>
          <a className="aav-link" href="/students/online-learning" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
