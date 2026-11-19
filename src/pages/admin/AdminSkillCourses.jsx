import AdminSidebar from "./AdminSidebar";
import "./AdminSkillCourses.css";

export default function AdminSkillCourses() {
  return (
    <AdminSidebar title="Skill courses">
      <section className="aaz-page" aria-labelledby="aaz-heading">
        <h2 id="aaz-heading">Skill courses</h2>
        <div className="aaz-card">
          <p>Editor coming soon.</p>
          <a className="aaz-link" href="/students/skill-courses" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
