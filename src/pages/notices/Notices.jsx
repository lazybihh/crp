// Notices.jsx - Notices (route: /notices).
// Page order: hero -> title + navy "latest" card -> tabs, search and category chips -> notice list -> help strip.
// Own hero, own styles (Notices.css, every class starts with "ntc-").
//
// WHAT IS REAL AND WHAT IS ASSUMED
//   REAL     all 40 notices and 10 activities below, in the same order as the live Notices page (newest first), with the same
//            titles. The live page has NO date field, so every `date` is empty - a year appears only where it is already in a title.
//   ASSUMED  the `category` of each notice (Admissions, Exams, ...). It is our grouping from the titles, not from the live site.
//   NO FILE  "Directions for manual counselling" and the second "Inviting Tender..." have no file on the live site (file: "").
//            They show as text only, with no dead link.
//
// ADMIN-READY: the two lists (`notices`, `activities`) now live in src/data/notices.js and are SHARED with the Home page notice board.
// Edit them there. Each item is one row:
//     { id, title, category, file, date, note }
//   id        a unique number          category  one of the ids in `categories` below (activities ignore it)
//   file      the file name inside public/docs/notices/ (".pdf .jpg .jpeg .png .docx .xlsx"), or "" for no file.
//             The file type badge (PDF / Image / Document / Sheet) is worked out from the extension.
//   date      optional, "YYYY-MM-DD". If set it is shown on the row and the list is sorted newest first.
//   note      optional one-line text under the title.
// To connect an admin panel later, replace the two lists with data fetched from the server in the same shape.
// To add a notice by hand: add a row at the TOP of `notices` and save the file in public/docs/notices/.
//
// FILES TO COPY: save every file in notice-files-list.txt into public/docs/notices/ with the SAME name.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiSearch, FiFileText, FiImage, FiGrid, FiExternalLink, FiClock,
  FiBell, FiPhone, FiMail, FiArrowRight, FiChevronDown,
} from "react-icons/fi";
import { FILE_FOLDER, categories, notices, activities, sortRows } from "../../data/notices";
import "./Notices.css";

const hero = { image: "/images/pages-banner.png" }; // wide photo; if it is missing a patterned navy banner shows instead

const intro = {
  eyebrow: "Latest updates",
  title: "Notices",
  lead: "Admission lists, exam datesheets, scholarships, holidays and other announcements from the institute.",
};

const contact = { phones: ["01262-274667", "01262-285667"], email: "crprohtak@hry.nic.in" };

const PAGE_SIZE = 10; // rows shown at first, and added each time "Show more" is pressed

// ---- helpers (no need to edit) ----
const FILE_TYPES = {
  pdf: { label: "PDF", icon: FiFileText },
  jpg: { label: "Image", icon: FiImage },
  jpeg: { label: "Image", icon: FiImage },
  png: { label: "Image", icon: FiImage },
  docx: { label: "Document", icon: FiFileText },
  doc: { label: "Document", icon: FiFileText },
  xlsx: { label: "Sheet", icon: FiGrid },
  xls: { label: "Sheet", icon: FiGrid },
};

const fileType = (file) => FILE_TYPES[file.split(".").pop().toLowerCase()] || { label: "File", icon: FiFileText };
const categoryLabel = (id) => categories.find((item) => item.id === id)?.label ?? "";
const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Notices() {
  const [tab, setTab] = useState("notices"); // "notices" or "activities"
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [pickOpen, setPickOpen] = useState(false); // the category dropdown on small screens
  const pickRef = useRef(null);

  // close the dropdown on an outside click or Escape
  useEffect(() => {
    if (!pickOpen) return undefined;
    const onDown = (event) => { if (pickRef.current && !pickRef.current.contains(event.target)) setPickOpen(false); };
    const onKey = (event) => { if (event.key === "Escape") setPickOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [pickOpen]);

  const source = tab === "notices" ? notices : activities;

  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return sortRows(source).filter(
      (row) =>
        (tab === "activities" || category === "all" || row.category === category) &&
        (!text || row.title.toLowerCase().includes(text)),
    );
  }, [source, tab, category, query]);

  const visible = rows.slice(0, shown);
  const latest = sortRows(notices)[0];

  const changeTab = (next) => { setTab(next); setCategory("all"); setShown(PAGE_SIZE); };
  const changeCategory = (next) => { setCategory(next); setShown(PAGE_SIZE); setPickOpen(false); };
  const changeQuery = (value) => { setQuery(value); setShown(PAGE_SIZE); };

  return (
    <main id="main" className="ntc-page">
      <section className="ntc-hero" aria-label="Notices" style={{ "--img": `url("${hero.image}")` }}>
        <div className="ntc-hero__photo" />
        <div className="ntc-hero__tags">
          <span className="ntc-hero__tag ntc-hero__tag--left">
            <span className="ntc-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="ntc-hero__tag ntc-hero__tag--right">
            <span className="ntc-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="ntc-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Notices</span>
        </nav>
      </section>

      <div className="container ntc-wrap">
        {/* ---- title + navy "at a glance" card ---- */}
        <div className="ntc-top">
          <header className="ntc-intro">
            <span className="ntc-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <aside className="ntc-glance" aria-labelledby="ntc-glance-title">
            <span className="ntc-glance__icon"><FiBell aria-hidden="true" /></span>
            <h2 id="ntc-glance-title">At a glance</h2>
            <dl>
              <div>
                <dt>Notices</dt>
                <dd>{notices.length}</dd>
              </div>
              <div>
                <dt>Activities</dt>
                <dd>{activities.length}</dd>
              </div>
            </dl>
            {latest && (
              <p className="ntc-glance__latest">
                <span>Latest notice</span>
                {latest.title}
              </p>
            )}
          </aside>
        </div>

        {/* ---- tabs, search, chips and the list ---- */}
        <section className="ntc-block" aria-labelledby="ntc-list-title">
          <header className="ntc-head">
            <span className="ntc-eyebrow ntc-eyebrow--line">Browse</span>
            <h2 id="ntc-list-title">All <span>announcements</span></h2>
          </header>

          <div className="ntc-bar">
            <div className="ntc-tabs" role="group" aria-label="Choose a list">
              <button type="button" aria-pressed={tab === "notices"} onClick={() => changeTab("notices")}>
                Notices <span>{notices.length}</span>
              </button>
              <button type="button" aria-pressed={tab === "activities"} onClick={() => changeTab("activities")}>
                Activities <span>{activities.length}</span>
              </button>
            </div>

            <label className="ntc-search">
              <span className="sr-only">Search notices by title</span>
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                placeholder="Search by title"
                onChange={(event) => changeQuery(event.target.value)}
              />
            </label>
          </div>

          {tab === "notices" && (
            <div className="ntc-chips" role="group" aria-label="Filter by category">
              <button type="button" aria-pressed={category === "all"} onClick={() => changeCategory("all")}>All</button>
              {categories.map((item) => (
                <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => changeCategory(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* small screens: "All" stays outside, the other categories are in a dropdown (two per row) */}
          {tab === "notices" && (
            <div className="ntc-pick" ref={pickRef} role="group" aria-label="Filter by category">
              <button type="button" className="ntc-pick__all" aria-pressed={category === "all"} onClick={() => changeCategory("all")}>All</button>
              <button
                type="button"
                className={`ntc-pick__btn${category !== "all" ? " is-set" : ""}`}
                aria-expanded={pickOpen}
                aria-controls="ntc-pick-panel"
                onClick={() => setPickOpen((open) => !open)}
              >
                <span>{category === "all" ? "Choose a category" : categoryLabel(category)}</span>
                <FiChevronDown aria-hidden="true" />
              </button>
              {pickOpen && (
                <div id="ntc-pick-panel" className="ntc-pick__panel">
                  {categories.map((item) => (
                    <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => changeCategory(item.id)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="ntc-count" aria-live="polite">
            Showing {visible.length} of {rows.length}
          </p>

          {visible.length > 0 ? (
            <ul className="ntc-list">
              {visible.map((row) => {
                const type = row.file ? fileType(row.file) : null;
                const Icon = type ? type.icon : FiClock;
                return (
                  <li key={`${tab}-${row.id}`} className="ntc-row">
                    <span className="ntc-row__icon"><Icon aria-hidden="true" /></span>
                    <div className="ntc-row__body">
                      <h3>{row.title}</h3>
                      <p className="ntc-row__meta">
                        {tab === "notices" && row.category && <span className="ntc-row__tag">{categoryLabel(row.category)}</span>}
                        {type && <span className="ntc-row__type">{type.label}</span>}
                        {row.date && <span className="ntc-row__date">{formatDate(row.date)}</span>}
                      </p>
                      {row.note && <p className="ntc-row__note">{row.note}</p>}
                    </div>
                    {row.file ? (
                      <a className="ntc-open" href={`${FILE_FOLDER}${row.file}`} target="_blank" rel="noopener noreferrer">
                        Open
                        <FiExternalLink aria-hidden="true" />
                        <span className="sr-only"> {row.title} (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="ntc-soon">File coming soon</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="ntc-empty">No notices match your search. Try a different word or choose All.</p>
          )}

          {rows.length > shown && (
            <button type="button" className="ntc-more" onClick={() => setShown(shown + PAGE_SIZE)}>
              Show more
            </button>
          )}
        </section>

        {/* ---- help strip ---- */}
        <section className="ntc-help" aria-labelledby="ntc-help-title">
          <div>
            <h2 id="ntc-help-title">Can&apos;t find a notice?</h2>
            <p>Ask the institute office. Some older notices may not be on this page.</p>
          </div>
          <div className="ntc-help__actions">
            <a className="ntc-btn ntc-btn--primary" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
              <FiPhone aria-hidden="true" />
              {contact.phones.join(" / ")}
            </a>
            <a className="ntc-btn ntc-btn--ghost" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
            <Link className="ntc-btn ntc-btn--ghost" to="/events">
              Events
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}