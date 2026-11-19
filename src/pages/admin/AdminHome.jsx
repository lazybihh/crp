import AdminSidebar from "./AdminSidebar";
import "./AdminHome.css";

export default function AdminHome() {
  return (
    <AdminSidebar title="Home">
      <section className="aaa-page" aria-labelledby="aaa-heading">
        <h2 id="aaa-heading">Home</h2>
        <div className="aaa-card">
          <p>Editor coming soon.</p>
          <a className="aaa-link" href="/" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
