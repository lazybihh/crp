// Admin dashboard. Page count comes from the sidebar navigation array.
import { Link } from "react-router-dom";
import { FiFileText, FiBell, FiMessageSquare, FiCalendar, FiHome, FiArrowRight, FiInbox } from "react-icons/fi";
import AdminSidebar, { ADMIN_MENU } from "./AdminSidebar";
import "./AdminDashboard.css";

const enquiryStats = { total: 0, fresh: 0 }; // PLACEHOLDER - filled from the server later
const latestEnquiries = []; // PLACEHOLDER - the newest 5 enquiries from the server

const editablePageCount = ADMIN_MENU.reduce((total, group) => total + group.items.length, 0);

const stats = [
  { icon: FiMessageSquare, label: "New enquiries", value: enquiryStats.fresh, hint: "Waiting for a reply", to: "/admin/enquiries", tone: "orange" },
  { icon: FiBell, label: "Notices", value: "—", hint: "Connect shared notices data", to: "/admin/notices", tone: "sky" },
  { icon: FiFileText, label: "Editable pages", value: editablePageCount, hint: "Individual page editors", to: "/admin/home", tone: "navy" },
  { icon: FiInbox, label: "All enquiries", value: enquiryStats.total, hint: "Since the site went live", to: "/admin/enquiries", tone: "sky" },
];

const actions = [
  { icon: FiHome, label: "Edit the Home page", to: "/admin/home" },
  { icon: FiBell, label: "Add or edit a notice", to: "/admin/notices" },
  { icon: FiCalendar, label: "Add an event", to: "/admin/events" },
  { icon: FiMessageSquare, label: "Read enquiries", to: "/admin/enquiries" },
];

export default function AdminDashboard() {
  return (
    <AdminSidebar title="Dashboard">
    <div className="adb-page">
      <section className="adb-welcome" aria-labelledby="adb-welcome-title">
        <div>
          <span className="adb-eyebrow">Welcome back</span>
          <h2 id="adb-welcome-title">Manage the Chhotu Ram Polytechnic website</h2>
          <p>Pick a page from the menu on the left to edit its content. Enquiries from the Contact page arrive under Enquiries.</p>
        </div>
        <Link className="adb-btn" to="/admin/home">
          Edit Home page
          <FiArrowRight aria-hidden="true" />
        </Link>
      </section>

      <ul className="adb-stats" aria-label="At a glance">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <Link className={`adb-stat adb-stat--${item.tone}`} to={item.to}>
                <span className="adb-stat__icon"><Icon aria-hidden="true" /></span>
                <span className="adb-stat__value">{item.value}</span>
                <span className="adb-stat__label">{item.label}</span>
                <span className="adb-stat__hint">{item.hint}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="adb-grid">
        <section className="adb-card" aria-labelledby="adb-actions-title">
          <h2 id="adb-actions-title">Quick actions</h2>
          <ul className="adb-actions">
            {actions.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link to={item.to}>
                    <span><Icon aria-hidden="true" /></span>
                    {item.label}
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="adb-card" aria-labelledby="adb-latest-title">
          <h2 id="adb-latest-title">Latest enquiries</h2>
          {latestEnquiries.length === 0 ? (
            <p className="adb-empty">
              <FiInbox aria-hidden="true" />
              No enquiries yet. New messages from the Contact page will show here.
            </p>
          ) : (
            <ul className="adb-latest">
              {latestEnquiries.map((item) => (
                <li key={item.id}>
                  <Link to="/admin/enquiries">
                    <strong>{item.name}</strong>
                    <span>{item.topic}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link className="adb-more" to="/admin/enquiries">
            Open all enquiries
            <FiArrowRight aria-hidden="true" />
          </Link>
        </section>


      </div>
    </div>
    </AdminSidebar>
  );
}
