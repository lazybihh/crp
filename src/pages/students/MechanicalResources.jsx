// MechanicalResources.jsx - Students > Departments > Mechanical Engineering study resources (route: /students/departments/mechanical).
// Page order: hero -> title + navy count card -> department row -> search, tabs and semester chips -> file list -> related links.
// Own hero, own styles (MechanicalResources.css, every class starts with "rmec-"). Nothing here is shared with another department.
//
// Direct links to a tab (for the Navbar or the Footer):
//   /students/departments/mechanical#lesson-plan    /students/departments/mechanical#outline-notes
//   /students/departments/mechanical#question-papers    /students/departments/mechanical#syllabus
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - the four lists in `tabs` below, one object per file:
//   name       what students see
//   semester   1 to 6, or 0 for a document that covers every semester
//   file       path of the file inside public/docs/mechanical/<folder>/  (nothing is loaded from the old website)
//   source     the file name on the old website - only a note so you know what to copy and rename (not shown on the page)
// Add a file = copy it into public/docs/mechanical/... and add ONE line to its list. Chips, counts and "Show more" update by themselves.
//
// FILES TO COPY from the old website (https://crprohtak.ac.in/media/Data/<source>) into public/docs/mechanical/ with the new names in `file`.
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiSearch, FiX, FiFileText, FiDownload, FiEye, FiArrowRight, FiArrowUpRight, FiBookOpen, FiCalendar, FiClipboard, FiLayers,
  FiMapPin, FiChevronRight as FiCrumbArrow,
} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import "./MechanicalResources.css";
import { getStudyResources, studyResourceFileUrl } from "../../services/studyResourceService";
import PageLoader, { usePageReady } from "../../components/PageLoader";

const defaultHero = { image: "/images/campus-2.jpg" }; // wide photo; if it is missing a patterned navy banner shows instead

const PAGE_SIZE = 12;

const defaultIntro = {
  eyebrow: "Students",
  title: "Mechanical Engineering",
  subtitle: "Study resources",
  lead: "Lesson plans, outline notes, previous question papers and the syllabus for every semester - all in one place.",
};

// This department's own page (About and Staff).
const defaultAboutLink = "/departments/mechanical";

// The department row. All seven are shown directly.
const switcher = {
  items: [
    { label: "Civil", to: "/students/departments/civil" },
    { label: "Computer", to: "/students/departments/computer" },
    { label: "Electrical", to: "/students/departments/electrical" },
    { label: "Electronics", to: "/students/departments/electronics" },
    { label: "Mechanical", to: "/students/departments/mechanical" },
    { label: "Plastic", to: "/students/departments/plastic" },
    { label: "Applied Sciences", to: "/students/departments/applied-science" },
  ],
  current: "/students/departments/mechanical",
};

const defaultTabs = [
  {
    id: "lesson-plan",
    label: "Lesson plan",
    icon: FiCalendar,
    files: [
      { name: "Thermodynamics-I", semester: 3, file: "/docs/mechanical/lesson-plan/thermodynamics-1-lesson-plan.pdf", source: "TD-1_lesson_plan_Mech._3rd.pdf" },
      { name: "Mech. Engg. Drawing", semester: 3, file: "/docs/mechanical/lesson-plan/mech-engg-drawing-lesson-plan.docx", source: "MED_3RDSEM_MECH.docx" },
      { name: "Strength Of Materials", semester: 3, file: "/docs/mechanical/lesson-plan/strength-of-materials-lesson-plan.pdf", source: "ME_SOM_3rd_BS.pdf" },
      { name: "Refrigeration & Air Conditioning", semester: 5, file: "/docs/mechanical/lesson-plan/refrigeration-and-air-conditioning-lesson-plan.pdf", source: "RAC__lesson_planMech.5th.pdf" },
      { name: "CNC Machines & Automation", semester: 5, file: "/docs/mechanical/lesson-plan/cnc-machines-and-automation-lesson-plan.pdf", source: "ME_CNC_5th_BS.pdf" },
      { name: "Industrial Engineering", semester: 5, file: "/docs/mechanical/lesson-plan/industrial-engineering-lesson-plan.pdf", source: "ME_IE_5th_BS.pdf" },
    ],
  },
  {
    id: "outline-notes",
    label: "Outline notes",
    icon: FiBookOpen,
    files: [], // the live page has no files yet - the tab shows "Files coming soon"
  },
  {
    id: "question-papers",
    label: "Question papers",
    icon: FiClipboard,
    files: [], // the live page has no files yet - the tab shows "Files coming soon"
  },
  {
    id: "syllabus",
    label: "Syllabus",
    icon: FiLayers,
    files: [
      { name: "Sem 1-6 Study Scheme & Syllabus", semester: 1, file: "/docs/mechanical/syllabus/study-scheme-and-syllabus-sem-1.pdf", source: "Mechanical_Engineering.pdf" },
    ],
  },
];

// Links at the bottom of the page.
const defaultRelated = [
  { label: "Academic calendar", text: "Session dates and holidays (PDF).", href: "/docs/academic-calendar-2025-26.pdf", external: true },
  { label: "Online learning portals", text: "NDLI, SWAYAM and HSBTE e-learning.", to: "/students/online-learning" },
  { label: "Student helpline", text: "Ask for help with studies or the campus.", to: "/students/helpline" },
];

// ---------------------------------------------------------------------------------------------

const typeOf = (file) => (file.split(".").pop() || "file").toUpperCase();
// PDFs open straight in the browser. Word and PowerPoint files cannot, so "View" opens them in Microsoft's free online viewer
// (it needs the site to be public, so it works on the live site but not on localhost).
const viewHref = (file) => {
  const url = studyResourceFileUrl(file);
  return url.toLowerCase().endsWith(".pdf")
    ? url
    : `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url.startsWith("http") ? url : window.location.origin + url)}`;
};
const semesterLabel = (n, tab) => tab?.filters?.find((filter) => Number(filter.value) === Number(n))?.label || (n === 0 ? "All semesters" : `Semester ${n}`);
const RESOURCE_ICONS = { "lesson-plan": FiCalendar, "outline-notes": FiBookOpen, "question-papers": FiClipboard, syllabus: FiLayers };

export default function MechanicalResources() {
  const { ready, data: pageData } = usePageReady(() => getStudyResources("mechanical"));
  const tabs = Array.isArray(pageData?.tabs) && pageData.tabs.length ? pageData.tabs : defaultTabs;
  const location = useLocation();
  const fromHash = () => {
    const id = location.hash.replace("#", "");
    return tabs.some((tab) => tab.id === id) ? id : tabs[0].id;
  };

  const [tabId, setTabId] = useState(fromHash);
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  // A link such as ...#syllabus opens that tab.
  useEffect(() => {
    setTabId(fromHash());
    setQuery("");
    setSemester("all");
    setLimit(PAGE_SIZE);
  }, [location.key, location.hash, tabs]);

  const pageIntro = pageData?.intro || defaultIntro;
  const pageHeroImage = pageData?.heroImage || defaultHero.image;
  const pageAboutLink = pageData?.aboutLink || defaultAboutLink;
  const pageRelated = pageData?.related?.length ? pageData.related : defaultRelated;
  const tab = tabs.find((item) => item.id === tabId) || tabs[0];
  const q = query.trim().toLowerCase();

  // Semester chips are made from the files in this tab, so empty semesters never appear.
  const semesters = useMemo(() => tab.filters?.length ? tab.filters.map((filter) => Number(filter.value)) : [...new Set(tab.files.map((file) => file.semester))].sort((a, b) => a - b), [tab]);

  const results = tab.files.filter(
    (file) =>
      (semester === "all" || file.semester === semester) &&
      (!q || file.name.toLowerCase().includes(q) || semesterLabel(file.semester, tab).toLowerCase().includes(q)),
  );
  const shown = results.slice(0, limit);
  const remaining = results.length - shown.length;

  const pickTab = (id) => {
    setTabId(id);
    setQuery("");
    setSemester("all");
    setLimit(PAGE_SIZE);
    window.history.replaceState(null, "", `#${id}`);
  };

  const onTabKey = (event) => {
    const index = tabs.findIndex((item) => item.id === tabId);
    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    if (next === null) return;
    event.preventDefault();
    pickTab(tabs[next].id);
    document.getElementById(`rmec-tab-${tabs[next].id}`)?.focus();
  };

  if (!ready) return <main id="main" className="rmec-page"><PageLoader /></main>;

  return (
    <main id="main" className="rmec-page">
      <section className="rmec-hero" aria-label="Mechanical Engineering study resources" style={{ "--img": `url("${studyResourceFileUrl(pageHeroImage)}")` }}>
        <div className="rmec-hero__photo" />
        <div className="rmec-hero__tags">
          <span className="rmec-hero__tag rmec-hero__tag--left">
            <span className="rmec-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="rmec-hero__tag rmec-hero__tag--right">
            <span className="rmec-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="rmec-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Mechanical Engineering</span>
        </nav>
      </section>

      <div className="container rmec-wrap">
        {/* ---- title + navy count card ---- */}
        <div className="rmec-top">
          <header className="rmec-intro">
            <span className="rmec-eyebrow">{pageIntro.eyebrow}</span>
            <h1>
              {pageIntro.title}
              <small>{pageIntro.subtitle}</small>
            </h1>
            <p>{pageIntro.lead}</p>
            <Link className="rmec-btn" to={pageAboutLink}>
              View department and staff
              <FiArrowRight aria-hidden="true" />
            </Link>
          </header>

          <dl className="rmec-stats" aria-label="Files available">
            {tabs.map((item) => (
              <div key={item.id}>
                <dt>{item.files.length}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---- department row ---- */}
        <nav className="rmec-switch" aria-label="Departments">
          <ul>
            {switcher.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`rmec-switch__link${item.to === switcher.current ? " is-current" : ""}`}
                  aria-current={item.to === switcher.current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---- search, tabs, semester chips ---- */}
        <section className="rmec-browser" aria-label="Study resources">
          <div className="rmec-toolbar">
            <div className="rmec-tabs" role="tablist" aria-label="Type of resource" onKeyDown={onTabKey}>
              {tabs.map((item) => {
                const Icon = item.icon || RESOURCE_ICONS[item.id] || FiFileText;
                const active = item.id === tabId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`rmec-tab-${item.id}`}
                    aria-selected={active}
                    aria-controls="rmec-panel"
                    tabIndex={active ? 0 : -1}
                    className={`rmec-tab${active ? " is-active" : ""}`}
                    onClick={() => pickTab(item.id)}
                  >
                    <Icon aria-hidden="true" />
                    {item.label}
                    <span className="rmec-tab__n">{item.files.length}</span>
                  </button>
                );
              })}
            </div>

            <div className="rmec-toolbar__row">
              <label className="rmec-search">
                <FiSearch aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE); }}
                  placeholder={`Search ${tab.label.toLowerCase()}`}
                  aria-label={`Search ${tab.label.toLowerCase()}`}
                />
                {query && (
                  <button type="button" className="rmec-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                    <FiX aria-hidden="true" />
                  </button>
                )}
              </label>
              <p className="rmec-count" aria-live="polite">
                <b>{results.length}</b> {results.length === 1 ? "file" : "files"}
              </p>
            </div>

            {semesters.length > 1 && (
              <div className="rmec-chips" role="group" aria-label="Filter by semester">
                {["all", ...semesters].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`rmec-chip${value === semester ? " is-active" : ""}`}
                    aria-pressed={value === semester}
                    onClick={() => { setSemester(value); setLimit(PAGE_SIZE); }}
                  >
                    {value === "all" ? "All" : semesterLabel(value, tab)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div id="rmec-panel" role="tabpanel" aria-labelledby={`rmec-tab-${tab.id}`} tabIndex={0} className="rmec-panel" key={tab.id}>
            {shown.length > 0 ? (
              <ul className="rmec-files">
                {shown.map((item) => {
                  const type = typeOf(item.file);
                  return (
                    <li key={`${item.file}`}>
                      <div className="rmec-file">
                        <span className={`rmec-file__type rmec-file__type--${type.toLowerCase()}`}>
                          <FiFileText aria-hidden="true" />
                          {type}
                        </span>
                        <span className="rmec-file__text">
                          <strong>{item.name}</strong>
                          <small>{semesterLabel(item.semester, tab)}</small>
                        </span>
                        <span className="rmec-file__actions">
                          <a className="rmec-file__go rmec-file__go--view" href={viewHref(item.file)} target="_blank" rel="noopener noreferrer">
                            <FiEye aria-hidden="true" />
                            View
                            <span className="sr-only"> {item.name} (opens in a new tab)</span>
                          </a>
                          <a className="rmec-file__go" href={studyResourceFileUrl(item.file)} download>
                            <FiDownload aria-hidden="true" />
                            Download
                            <span className="sr-only"> {item.name}</span>
                          </a>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rmec-none">
                <span className="rmec-none__icon"><FiFileText aria-hidden="true" /></span>
                <h2>{q || semester !== "all" ? "No files found" : "Files coming soon"}</h2>
                <p>{q || semester !== "all" ? "Try another word or choose a different semester." : "These files will be added shortly."}</p>
                {(q || semester !== "all") && (
                  <button type="button" className="rmec-btn" onClick={() => { setQuery(""); setSemester("all"); }}>
                    Show all files
                  </button>
                )}
              </div>
            )}

            {remaining > 0 && (
              <div className="rmec-more">
                <button type="button" className="rmec-btn" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, remaining)} more files
                </button>
                <span>{remaining} more in this view</span>
              </div>
            )}
          </div>
        </section>

        {/* ---- related links ---- */}
        <section className="rmec-related" aria-label="More for students">
          {pageRelated.map((item) =>
            item.external ? (
              <a key={item.label} className="rmec-related__item" href={item.href} target="_blank" rel="noopener noreferrer">
                <span><strong>{item.label}</strong>{item.text}</span>
                <FiArrowUpRight aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <Link key={item.label} className="rmec-related__item" to={item.to}>
                <span><strong>{item.label}</strong>{item.text}</span>
                <FiArrowRight aria-hidden="true" />
              </Link>
            ),
          )}
        </section>
      </div>
    </main>
  );
}