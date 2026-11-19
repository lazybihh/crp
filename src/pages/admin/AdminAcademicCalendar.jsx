import AdminSidebar from "./AdminSidebar";
import "./AdminAcademicCalendar.css";

export default function AdminAcademicCalendar() {
  return (
    <AdminSidebar title="Academic calendar">
      <section className="aau-page" aria-labelledby="aau-heading">
        <h2 id="aau-heading">Academic calendar</h2>
        <div className="aau-card">
          <p>Editor coming soon.</p>
          <a className="aau-link" href="/students/academic-calendar" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
