import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiInbox, FiChevronDown, FiPhone, FiMail, FiCheck, FiArchive, FiTrash2, FiCornerUpLeft } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getEnquiries, setEnquiryStatus, deleteEnquiry } from "../../services/enquiryService";
import "./AdminEnquiries.css";

const STATUSES = [
  { id: "all", label: "All" }, { id: "new", label: "New" }, { id: "read", label: "Read" },
  { id: "replied", label: "Replied" }, { id: "archived", label: "Archived" },
];
const formatDate = (value) => new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

export default function AdminEnquiries() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getEnquiries().then((rows) => { setItems(rows); setFailed(false); }).catch(() => setFailed(true));
  }, []);

  const counts = useMemo(() => {
    const result = { all: items.length };
    STATUSES.slice(1).forEach((status) => { result[status.id] = items.filter((item) => item.status === status.id).length; });
    return result;
  }, [items]);
  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return items.filter((item) => filter === "all" || item.status === filter)
      .filter((item) => !text || [item.name, item.email, item.phone, item.topic, item.message].some((field) => (field || "").toLowerCase().includes(text)))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }, [items, filter, query]);

  const updateStatus = async (id, status) => {
    try {
      await setEnquiryStatus(id, status);
      setItems((list) => list.map((item) => (item._id === id ? { ...item, status } : item)));
      window.dispatchEvent(new Event("enquiries-updated"));
    } catch { setFailed(true); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    try {
      await deleteEnquiry(id);
      setItems((list) => list.filter((item) => item._id !== id));
      setOpenId(null);
      window.dispatchEvent(new Event("enquiries-updated"));
    } catch { setFailed(true); }
  };
  const toggle = (item) => {
    const next = openId === item._id ? null : item._id;
    setOpenId(next);
    if (next !== null && item.status === "new") updateStatus(item._id, "read");
  };

  return (
    <AdminSidebar title="Enquiries">
      <div className="aeq-page">
        {failed && <p className="aeq-demo">Cannot reach the server. Start the backend, then reload this page.</p>}
        <div className="aeq-bar">
          <div className="aeq-tabs" role="group" aria-label="Filter by status">
            {STATUSES.map((status) => (
              <button key={status.id} type="button" aria-pressed={filter === status.id} onClick={() => setFilter(status.id)}>
                {status.label} <span>{counts[status.id] || 0}</span>
              </button>
            ))}
          </div>
          <label className="aeq-search"><span className="sr-only">Search enquiries</span><FiSearch aria-hidden="true" /><input type="search" value={query} placeholder="Search name, email or message" onChange={(event) => setQuery(event.target.value)} /></label>
        </div>
        <p className="aeq-count" aria-live="polite">Showing {rows.length} of {items.length}</p>
        {rows.length === 0 ? (
          <div className="aeq-empty"><FiInbox aria-hidden="true" /><h2>{items.length === 0 ? "No enquiries yet" : "No enquiries match"}</h2><p>{items.length === 0 ? "Messages sent from the Contact page will appear here." : "Try another word or choose All."}</p></div>
        ) : (
          <ul className="aeq-list">
            {rows.map((item) => {
              const isOpen = openId === item._id;
              return (
                <li key={item._id} className={`aeq-row aeq-row--${item.status}${isOpen ? " is-open" : ""}`}>
                  <button type="button" className="aeq-row__head" aria-expanded={isOpen} aria-controls={`aeq-detail-${item._id}`} onClick={() => toggle(item)}>
                    <span className="aeq-dot" aria-hidden="true" /><span className="aeq-row__who"><strong>{item.name}</strong><span>{item.topic}</span></span>
                    <span className="aeq-status">{STATUSES.find((status) => status.id === item.status)?.label}</span>
                    <time className="aeq-row__time" dateTime={item.createdAt}>{formatDate(item.createdAt)}</time><FiChevronDown className="aeq-caret" aria-hidden="true" />
                  </button>
                  <div id={`aeq-detail-${item._id}`} className="aeq-detail" hidden={!isOpen}>
                    <p className="aeq-message">{item.message}</p>
                    <dl className="aeq-facts">
                      <div><dt>Role</dt><dd>{item.role || "-"}</dd></div><div><dt>Department</dt><dd>{item.department || "-"}</dd></div>
                      <div><dt>Phone</dt><dd>{item.phone ? <a href={`tel:${item.phone}`}>{item.phone}</a> : "-"}</dd></div>
                      <div><dt>Email</dt><dd>{item.email ? <a href={`mailto:${item.email}`}>{item.email}</a> : "-"}</dd></div>
                    </dl>
                    <div className="aeq-actions">
                      {item.email && <a className="aeq-btn aeq-btn--primary" href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.topic}`)}`} onClick={() => updateStatus(item._id, "replied")}><FiMail aria-hidden="true" /> Reply by email</a>}
                      {item.phone && <a className="aeq-btn aeq-btn--line" href={`tel:${item.phone}`}><FiPhone aria-hidden="true" /> Call</a>}
                      {item.status !== "replied" && <button type="button" className="aeq-btn aeq-btn--line" onClick={() => updateStatus(item._id, "replied")}><FiCheck aria-hidden="true" /> Mark replied</button>}
                      {item.status !== "archived"
                        ? <button type="button" className="aeq-btn aeq-btn--line" onClick={() => updateStatus(item._id, "archived")}><FiArchive aria-hidden="true" /> Archive</button>
                        : <button type="button" className="aeq-btn aeq-btn--line" onClick={() => updateStatus(item._id, "read")}><FiCornerUpLeft aria-hidden="true" /> Restore</button>}
                      <button type="button" className="aeq-btn aeq-btn--danger" onClick={() => remove(item._id)}><FiTrash2 aria-hidden="true" /> Delete</button>
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
