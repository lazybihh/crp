// Enquiries.jsx - /admin/enquiries. Messages sent from the website's Contact page.
// The list is empty until the backend exists. To SEE the layout with sample rows, set DEMO = true below (sample data only).
//
// One enquiry = { id, name, phone, email, role, department, topic, message, createdAt ("YYYY-MM-DDTHH:mm"), status }
//   status: "new" | "read" | "replied" | "archived"   (same fields as the Contact page form)
// Buttons change the status in this page only; they are connected to the server with the backend.
// Styles: Enquiries.css (every class starts with "aeq-").
import { useMemo, useState } from "react";
import { FiSearch, FiInbox, FiChevronDown, FiPhone, FiMail, FiCheck, FiArchive, FiTrash2, FiCornerUpLeft } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import "./AdminEnquiries.css";

const DEMO = true;

// SAMPLE - invented rows, only shown when DEMO is true
const SAMPLE = [
  { id: 1, name: "Sample Parent", phone: "98XXXXXX01", email: "sample1@example.com", role: "Parent / guardian", department: "Computer Engineering", topic: "Admissions", message: "Sample message: what documents are needed for counselling?", createdAt: "2026-11-18T10:20", status: "new" },
  { id: 2, name: "Sample Student", phone: "98XXXXXX02", email: "sample2@example.com", role: "Current student", department: "Not sure yet", topic: "Exams", message: "Sample message: when is the datesheet coming?", createdAt: "2026-11-17T16:05", status: "read" },
  { id: 3, name: "Sample Alumnus", phone: "", email: "sample3@example.com", role: "Alumnus / alumna", department: "Mechanical Engineering", topic: "Other", message: "Sample message: how do I get my diploma copy?", createdAt: "2026-11-15T09:40", status: "replied" },
];

const STATUSES = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "replied", label: "Replied" },
  { id: "archived", label: "Archived" },
];

const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

export default function AdminEnquiries() {
  const [items, setItems] = useState(DEMO ? SAMPLE : []);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const counts = useMemo(() => {
    const result = { all: items.length };
    STATUSES.slice(1).forEach((status) => { result[status.id] = items.filter((item) => item.status === status.id).length; });
    return result;
  }, [items]);

  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items
      .filter((item) => filter === "all" || item.status === filter)
      .filter((item) => !text || [item.name, item.email, item.phone, item.topic, item.message].some((field) => (field || "").toLowerCase().includes(text)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [items, filter, query]);

  const setStatus = (id, status) => setItems((list) => list.map((item) => (item.id === id ? { ...item, status } : item)));
  const remove = (id) => { setItems((list) => list.filter((item) => item.id !== id)); setOpenId(null); };
  const toggle = (item) => {
    const next = openId === item.id ? null : item.id;
    setOpenId(next);
    if (next !== null && item.status === "new") setStatus(item.id, "read"); // opening a new enquiry marks it read
  };

  return (
    <AdminSidebar title="Enquiries">
    <div className="aeq-page">
      {DEMO && <p className="aeq-demo">DEMO · SAMPLE enquiries only</p>}
      <div className="aeq-bar">
        <div className="aeq-tabs" role="group" aria-label="Filter by status">
          {STATUSES.map((status) => (
            <button key={status.id} type="button" aria-pressed={filter === status.id} onClick={() => setFilter(status.id)}>
              {status.label} <span>{counts[status.id]}</span>
            </button>
          ))}
        </div>
        <label className="aeq-search">
          <span className="sr-only">Search enquiries</span>
          <FiSearch aria-hidden="true" />
          <input type="search" value={query} placeholder="Search name, email or message" onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>

      <p className="aeq-count" aria-live="polite">Showing {rows.length} of {items.length}</p>

      {rows.length === 0 ? (
        <div className="aeq-empty">
          <FiInbox aria-hidden="true" />
          <h2>{items.length === 0 ? "No enquiries yet" : "No enquiries match"}</h2>
          <p>{items.length === 0 ? "Messages sent from the Contact page will appear here." : "Try another word or choose All."}</p>
        </div>
      ) : (
        <ul className="aeq-list">
          {rows.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li key={item.id} className={`aeq-row aeq-row--${item.status}${isOpen ? " is-open" : ""}`}>
                <button type="button" className="aeq-row__head" aria-expanded={isOpen} aria-controls={`aeq-detail-${item.id}`} onClick={() => toggle(item)}>
                  <span className="aeq-dot" aria-hidden="true" />
                  <span className="aeq-row__who">
                    <strong>{item.name}</strong>
                    <span>{item.topic}</span>
                  </span>
                  <span className="aeq-status">{STATUSES.find((status) => status.id === item.status)?.label}</span>
                  <time className="aeq-row__time" dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
                  <FiChevronDown className="aeq-caret" aria-hidden="true" />
                </button>

                <div id={`aeq-detail-${item.id}`} className="aeq-detail" hidden={!isOpen}>
                  <p className="aeq-message">{item.message}</p>
                  <dl className="aeq-facts">
                    <div><dt>Role</dt><dd>{item.role || "-"}</dd></div>
                    <div><dt>Department</dt><dd>{item.department || "-"}</dd></div>
                    <div><dt>Phone</dt><dd>{item.phone ? <a href={`tel:${item.phone}`}>{item.phone}</a> : "-"}</dd></div>
                    <div><dt>Email</dt><dd>{item.email ? <a href={`mailto:${item.email}`}>{item.email}</a> : "-"}</dd></div>
                  </dl>
                  <div className="aeq-actions">
                    {item.email && (
                      <a className="aeq-btn aeq-btn--primary" href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.topic}`)}`} onClick={() => setStatus(item.id, "replied")}>
                        <FiMail aria-hidden="true" /> Reply by email
                      </a>
                    )}
                    {item.phone && (
                      <a className="aeq-btn aeq-btn--line" href={`tel:${item.phone}`}>
                        <FiPhone aria-hidden="true" /> Call
                      </a>
                    )}
                    {item.status !== "replied" && (
                      <button type="button" className="aeq-btn aeq-btn--line" onClick={() => setStatus(item.id, "replied")}>
                        <FiCheck aria-hidden="true" /> Mark replied
                      </button>
                    )}
                    {item.status !== "archived" ? (
                      <button type="button" className="aeq-btn aeq-btn--line" onClick={() => setStatus(item.id, "archived")}>
                        <FiArchive aria-hidden="true" /> Archive
                      </button>
                    ) : (
                      <button type="button" className="aeq-btn aeq-btn--line" onClick={() => setStatus(item.id, "read")}>
                        <FiCornerUpLeft aria-hidden="true" /> Restore
                      </button>
                    )}
                    <button type="button" className="aeq-btn aeq-btn--danger" onClick={() => remove(item.id)}>
                      <FiTrash2 aria-hidden="true" /> Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
    </AdminSidebar>
  );
}
