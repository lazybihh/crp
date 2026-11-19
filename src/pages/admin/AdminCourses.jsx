import AdminSidebar from "./AdminSidebar";
import "./AdminCourses.css";

export default function AdminCourses() {
  return (
    <AdminSidebar title="Courses offered">
      <section className="aah-page" aria-labelledby="aah-heading">
        <h2 id="aah-heading">Courses offered</h2>
        <div className="aah-card">
          <p>Editor coming soon.</p>
          <a className="aah-link" href="/about/courses" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
