import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiInbox, FiChevronDown, FiPhone, FiMail, FiCheck, FiArchive, FiTrash2, FiCornerUpLeft, FiDownload } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getEnquiries, setEnquiryStatus, deleteEnquiry } from "../../services/enquiryService";
import "./AdminEnquiries.css";

const STATUSES = [
  { id: "all", label: "All" }, { id: "new", label: "New" }, { id: "read", label: "Read" },
  { id: "replied", label: "Replied" }, { id: "archived", label: "Archived" },
];
// Form type is stored separately so each public form remains easy to review.
const KINDS = [
  { id: "all", label: "All" }, { id: "contact", label: "Contact" },
  { id: "course-enquiry", label: "Enquiry" }, { id: "admission-form", label: "Admission" },
  { id: "anti-ragging", label: "Ragging" }, { id: "anti-sexual-harassment", label: "Harassment" },
];
const kindOf = (item) => item.kind === "enquiry" || !item.kind ? "contact" : item.kind;
const kindLabel = (kind) => ({ contact: "Contact", enquiry: "Contact", "admission-form": "Admission", "course-enquiry": "Enquiry", "anti-ragging": "Ragging", "anti-sexual-harassment": "Harassment" }[kind] || kind || "Contact");
const formatDate = (value) => new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

function exportCsv(rows) {
  const columns = [
    ["Submitted at", (item) => item.createdAt ? new Date(item.createdAt).toISOString() : ""],
    ["Form type", (item) => kindLabel(kindOf(item))], ["Status", (item) => item.status],
    ["Name", (item) => item.name], ["Phone", (item) => item.phone], ["Email", (item) => item.email],
    ["Role / relationship", (item) => item.role], ["Department / course", (item) => item.department],
    ["Qualification", (item) => item.qualification], ["Admission session", (item) => item.admissionSession],
    ["Topic", (item) => item.topic], ["Message / details", (item) => item.message],
    ["Contact info", (item) => item.contact], ["Incident date", (item) => item.incidentDate],
    ["Location", (item) => item.location], ["Person involved", (item) => item.involved],
    ["Contact preference", (item) => item.contactPreference],
  ];
  const cell = (value) => {
    let text = String(value ?? "").replace(/\r\n?/g, "\n");
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const csv = [columns.map(([label]) => label), ...rows.map((item) => columns.map(([, getValue]) => getValue(item)))].map((line) => line.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminEnquiries() {
  const [items, setItems] = useState([]);
  const [kind, setKind] = useState("all");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getEnquiries().then((rows) => { setItems(rows); setFailed(false); }).catch(() => setFailed(true));
  }, []);

  const ofKind = useMemo(() => items.filter((item) => kind === "all" || kindOf(item) === kind), [items, kind]);
  const kindCounts = useMemo(() => {
    const result = { all: items.length };
    KINDS.slice(1).forEach((entry) => { result[entry.id] = items.filter((item) => kindOf(item) === entry.id).length; });
    return result;
  }, [items]);
  const counts = useMemo(() => {
    const result = { all: ofKind.length };
    STATUSES.slice(1).forEach((status) => { result[status.id] = ofKind.filter((item) => item.status === status.id).length; });
    return result;
  }, [ofKind]);
  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return ofKind.filter((item) => filter === "all" || item.status === filter)
      .filter((item) => !text || [item.name, item.email, item.phone, item.contact, item.topic, item.location, item.involved, item.department, item.qualification, item.admissionSession, item.message].some((field) => (field || "").toLowerCase().includes(text)))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }, [ofKind, filter, query]);

  const updateStatus = async (id, status) => {
    try {
      await setEnquiryStatus(id, status);
      setItems((list) => list.map((item) => (item._id === id ? { ...item, status } : item)));
      window.dispatchEvent(new Event("enquiries-updated"));
    } catch { setFailed(true); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this permanently?")) return;
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
    <AdminSidebar title="Enquiries & complaints">
      <div className="aeq-page">
        {failed && <p className="aeq-demo">Cannot reach the server. Start the backend, then reload this page.</p>}
        <div className="aeq-kinds">
          <div className="aeq-tabs" role="group" aria-label="Filter by type">
            {KINDS.map((entry) => (
              <button key={entry.id} type="button" aria-pressed={kind === entry.id} onClick={() => setKind(entry.id)}>
                {entry.label} <span>{kindCounts[entry.id] || 0}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="aeq-bar">
          <div className="aeq-tabs" role="group" aria-label="Filter by status">
            {STATUSES.map((status) => (
              <button key={status.id} type="button" aria-pressed={filter === status.id} onClick={() => setFilter(status.id)}>
                {status.label} <span>{counts[status.id] || 0}</span>
              </button>
            ))}
          </div>
          <label className="aeq-search"><span className="sr-only">Search enquiries and complaints</span><FiSearch aria-hidden="true" /><input type="search" value={query} placeholder="Search name, contact or message" onChange={(event) => setQuery(event.target.value)} /></label>
          <button type="button" className="aeq-export" onClick={() => exportCsv(rows)} disabled={!rows.length} title="Download the displayed records as an Excel-compatible CSV"><FiDownload aria-hidden="true" /> Export CSV</button>
        </div>
        <p className="aeq-count" aria-live="polite">Showing {rows.length} of {ofKind.length}</p>
        {rows.length === 0 ? (
          <div className="aeq-empty"><FiInbox aria-hidden="true" /><h2>{ofKind.length === 0 ? "Nothing here yet" : "Nothing matches"}</h2><p>{ofKind.length === 0 ? "Contact messages, admission forms, course enquiries and complaints will appear here." : "Try another word or choose All."}</p></div>
        ) : (
          <ul className="aeq-list">
            {rows.map((item) => {
              const isOpen = openId === item._id;
              const complaint = ["anti-ragging", "anti-sexual-harassment"].includes(kindOf(item));
              const mail = item.email || (/@/.test(item.contact || "") ? item.contact : "");
              const tel = item.phone || (/^[\d\s+()-]{7,}$/.test(item.contact || "") ? item.contact : "");
              return (
                <li key={item._id} className={`aeq-row aeq-row--${item.status}${isOpen ? " is-open" : ""}`}>
                  <button type="button" className="aeq-row__head" aria-expanded={isOpen} aria-controls={`aeq-detail-${item._id}`} onClick={() => toggle(item)}>
                    <span className="aeq-dot" aria-hidden="true" /><span className="aeq-row__who"><strong>{item.name}</strong><span>{complaint && <b className="aeq-tag">Complaint</b>}{item.topic || (kindOf(item) === "admission-form" ? "Admission form" : kindOf(item) === "course-enquiry" ? "Course enquiry" : "Contact")}</span></span>
                    <span className="aeq-status">{STATUSES.find((status) => status.id === item.status)?.label}</span>
                    <time className="aeq-row__time" dateTime={item.createdAt}>{formatDate(item.createdAt)}</time><FiChevronDown className="aeq-caret" aria-hidden="true" />
                  </button>
                  <div id={`aeq-detail-${item._id}`} className="aeq-detail" hidden={!isOpen}>
                    <p className="aeq-message">{item.message}</p>
                    <dl className="aeq-facts">
                      <div><dt>{complaint ? "Submitted by" : "Role"}</dt><dd>{complaint ? `${item.name}${item.role ? ` (${item.role})` : ""}` : item.role || "-"}</dd></div><div><dt>Department</dt><dd>{item.department || "-"}</dd></div>
                      {kindOf(item) === "admission-form" && <><div><dt>Qualification</dt><dd>{item.qualification || "-"}</dd></div><div><dt>Admission session</dt><dd>{item.admissionSession || "-"}</dd></div></>}
                      <div><dt>Phone</dt><dd>{tel ? <a href={`tel:${tel}`}>{tel}</a> : "-"}</dd></div>
                      <div><dt>Email</dt><dd>{mail ? <a href={`mailto:${mail}`}>{mail}</a> : "-"}</dd></div>
                      {complaint && (
                        <>
                          <div><dt>Date of incident</dt><dd>{item.incidentDate || "-"}</dd></div><div><dt>Location</dt><dd>{item.location || "-"}</dd></div>
                          <div><dt>Person(s) involved</dt><dd>{item.involved || "-"}</dd></div>
                          {item.contactPreference && <div><dt>Contact preference</dt><dd>{item.contactPreference}</dd></div>}
                          {item.contact && !mail && !tel && <div><dt>Contact given</dt><dd>{item.contact}</dd></div>}
                        </>
                      )}
                    </dl>
                    <div className="aeq-actions">
                      {mail && <a className="aeq-btn aeq-btn--primary" href={`mailto:${mail}?subject=${encodeURIComponent(`Re: ${item.topic}`)}`} onClick={() => updateStatus(item._id, "replied")}><FiMail aria-hidden="true" /> Reply by email</a>}
                      {tel && <a className="aeq-btn aeq-btn--line" href={`tel:${tel}`}><FiPhone aria-hidden="true" /> Call</a>}
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
