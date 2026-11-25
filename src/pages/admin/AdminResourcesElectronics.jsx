import AdminSidebar from "./AdminSidebar";
import "./AdminResourcesElectronics.css";

export default function AdminResourcesElectronics() {
  return (
    <AdminSidebar title="Electronics study resources">
      <section className="abi-page" aria-labelledby="abi-heading">
        <h2 id="abi-heading">Electronics study resources</h2>
        <div className="abi-card">
          <p>Editor coming soon.</p>
          <a className="abi-link" href="/students/departments/electronics" target="_blank" rel="noopener noreferrer">See the live page</a>
        </div>
      </section>
    </AdminSidebar>
  );
}
