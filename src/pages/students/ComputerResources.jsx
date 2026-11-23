// ComputerResources.jsx - Students > Departments > Computer Engineering study resources (route: /students/departments/computer).
// Page order: hero -> title + navy count card -> department row -> search, tabs and semester chips -> file list -> related links.
// Own hero, own styles (ComputerResources.css, every class starts with "rcse-"). Nothing here is shared with another department.
//
// Direct links to a tab (for the Navbar or the Footer):
//   /students/departments/computer#lesson-plan    /students/departments/computer#outline-notes
//   /students/departments/computer#question-papers    /students/departments/computer#syllabus
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - the four lists in `tabs` below, one object per file:
//   name       what students see
//   semester   1 to 6, or 0 for a document that covers every semester
//   file       path of the file inside public/docs/computer/<folder>/  (nothing is loaded from the old website)
//   source     the file name on the old website - only a note so you know what to copy and rename (not shown on the page)
// Add a file = copy it into public/docs/computer/... and add ONE line to its list. Chips, counts and "Show more" update by themselves.
//
// FILES TO COPY from the old website (https://crprohtak.ac.in/media/Data/<source>) into public/docs/computer/ with the new names in `file`.
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiSearch, FiX, FiFileText, FiDownload, FiEye, FiArrowRight, FiArrowUpRight, FiBookOpen, FiCalendar, FiClipboard, FiLayers,
  FiMapPin, FiChevronRight as FiCrumbArrow,
} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import "./ComputerResources.css";
import { getStudyResources, studyResourceFileUrl } from "../../services/studyResourceService";

const defaultHero = { image: "/images/pages-banner.png" }; // wide photo; if it is missing a patterned navy banner shows instead

const PAGE_SIZE = 12;

const defaultIntro = {
  eyebrow: "Students",
  title: "Computer Engineering",
  subtitle: "Study resources",
  lead: "Lesson plans, outline notes, previous question papers and the syllabus for every semester - all in one place.",
};

// This department's own page (About and Staff).
const defaultAboutLink = "/departments/computer";

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
  current: "/students/departments/computer",
};

const defaultTabs = [
  {
    id: "lesson-plan",
    label: "Lesson plan",
    icon: FiCalendar,
    files: [
      { name: "PIC", semester: 3, file: "/docs/computer/lesson-plan/pic-lesson-plan.docx", source: "PIC__Lesson_Plan.docx" },
      { name: "O.S", semester: 3, file: "/docs/computer/lesson-plan/operating-system-lesson-plan.docx", source: "lesson_plan_Operating_System1_1.docx" },
      { name: "DBMS", semester: 3, file: "/docs/computer/lesson-plan/dbms-lesson-plan.docx", source: "D.B.M.S_Lession_Plan.docx" },
      { name: "D.E", semester: 3, file: "/docs/computer/lesson-plan/de-lesson-plan.docx", source: "Lesson_Plan_DE.docx" },
      { name: "Computer Networks", semester: 5, file: "/docs/computer/lesson-plan/computer-networks-lesson-plan.docx", source: "Lesson_Plan_CN.docx" },
      { name: "Cloud Computing", semester: 5, file: "/docs/computer/lesson-plan/cloud-computing-lesson-plan.docx", source: "Priyankacloud_computing_5th.docx" },
      { name: "PHP", semester: 5, file: "/docs/computer/lesson-plan/php-lesson-plan.docx", source: "Priyankaphp_5th_sem.docx" },
      { name: "Python", semester: 5, file: "/docs/computer/lesson-plan/python-lesson-plan.docx", source: "Dr_R.Rathee__Python.docx" },
    ],
  },
  {
    id: "outline-notes",
    label: "Outline notes",
    icon: FiBookOpen,
    files: [
      { name: "DBMS E-Contents", semester: 3, file: "/docs/computer/outline-notes/dbms-e-contents.pptx", source: "dbms_semester_IV.pptx" },
      { name: "Cloud Computing E-Contents", semester: 5, file: "/docs/computer/outline-notes/cloud-computing-e-contents.pdf", source: "cloud_V.pdf" },
      { name: "Computer Networks E-Contents Part 1", semester: 5, file: "/docs/computer/outline-notes/computer-networks-e-contents-part-1.pdf", source: "COMPUTER_NETWORKS_UNIT_123.pdf" },
      { name: "Computer Networks E-Contents Part 2", semester: 5, file: "/docs/computer/outline-notes/computer-networks-e-contents-part-2.pdf", source: "COMPUTER_NETWORS_4-7.pdf" },
    ],
  },
  {
    id: "question-papers",
    label: "Question papers",
    icon: FiClipboard,
    files: [
      { name: "Programming in C", semester: 3, file: "/docs/computer/question-papers/programming-in-c-sem-3.pdf", source: "PIC-3rd-sem.pdf" },
      { name: "Operating System", semester: 3, file: "/docs/computer/question-papers/operating-system-sem-3.pdf", source: "OS-3Sem.pdf" },
      { name: "Computer Networks", semester: 5, file: "/docs/computer/question-papers/computer-networks-sem-5.pdf", source: "computer-network-5th-sem-question-paper.pdf" },
      { name: "Cloud Computing", semester: 5, file: "/docs/computer/question-papers/cloud-computing-sem-5.pdf", source: "Cloud-computing-5th-sem.pdf" },
      { name: "Python", semester: 5, file: "/docs/computer/question-papers/python-sem-5.pdf", source: "computer-5-sem-python.pdf" },
      { name: "PHP", semester: 5, file: "/docs/computer/question-papers/php-sem-5.pdf", source: "php-5th-sem.pdf" },
      { name: "Software Engineering", semester: 5, file: "/docs/computer/question-papers/software-engineering-sem-5.pdf", source: "software-engineering.pdf" },
    ],
  },
  {
    id: "syllabus",
    label: "Syllabus",
    icon: FiLayers,
    files: [
      { name: "Computer Engineering", semester: 0, file: "/docs/computer/syllabus/computer-engineering.pdf", source: "Computer_Engineering.pdf" },
      { name: "Sem 1-6 Study Scheme & Syllabus", semester: 1, file: "/docs/computer/syllabus/study-scheme-and-syllabus-sem-1.pdf", source: "Computer_Engineering_o08TrpC.pdf" },
      { name: "Sem 1-6 Study Scheme & Syllabus", semester: 3, file: "/docs/computer/syllabus/study-scheme-and-syllabus-sem-3.pdf", source: "Computer_Engineering_itcSZcb.pdf" },
      { name: "Sem 1-6 Study Scheme & Syllabus", semester: 5, file: "/docs/computer/syllabus/study-scheme-and-syllabus-sem-5.pdf", source: "Computer_Engineering_QhWDF5y.pdf" },
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

export default function ComputerResources() {
  const [tabs, setTabs] = useState(defaultTabs);
  const [pageData, setPageData] = useState({});
  const location = useLocation();
  const fromHash = () => {
    const id = location.hash.replace("#", "");
    return tabs.some((tab) => tab.id === id) ? id : tabs[0].id;
  };

  const [tabId, setTabId] = useState(fromHash);
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    let active = true;
    getStudyResources("computer")
      .then((data) => { if (active) { if (Array.isArray(data.tabs) && data.tabs.length) setTabs(data.tabs); setPageData(data); } })
      .catch(() => { /* Keep the built-in page content when the API is unavailable. */ });
    return () => { active = false; };
  }, []);

  // A link such as ...#syllabus opens that tab.
  useEffect(() => {
    setTabId(fromHash());
    setQuery("");
    setSemester("all");
    setLimit(PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, location.hash]);

  const pageIntro = pageData.intro || defaultIntro;
  const pageHeroImage = pageData.heroImage || defaultHero.image;
  const pageAboutLink = pageData.aboutLink || defaultAboutLink;
  const pageRelated = pageData.related?.length ? pageData.related : defaultRelated;
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
    document.getElementById(`rcse-tab-${tabs[next].id}`)?.focus();
  };

  return (
    <main id="main" className="rcse-page">
      <section className="rcse-hero" aria-label="Computer Engineering study resources" style={{ "--img": `url("${pageHeroImage}")` }}>
        <div className="rcse-hero__photo" />
        <div className="rcse-hero__tags">
          <span className="rcse-hero__tag rcse-hero__tag--left">
            <span className="rcse-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="rcse-hero__tag rcse-hero__tag--right">
            <span className="rcse-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="rcse-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Computer Engineering</span>
        </nav>
      </section>

      <div className="container rcse-wrap">
        {/* ---- title + navy count card ---- */}
        <div className="rcse-top">
          <header className="rcse-intro">
            <span className="rcse-eyebrow">{pageIntro.eyebrow}</span>
            <h1>
              {pageIntro.title}
              <small>{pageIntro.subtitle}</small>
            </h1>
            <p>{pageIntro.lead}</p>
            <Link className="rcse-btn" to={pageAboutLink}>
              View department and staff
              <FiArrowRight aria-hidden="true" />
            </Link>
          </header>

          <dl className="rcse-stats" aria-label="Files available">
            {tabs.map((item) => (
              <div key={item.id}>
                <dt>{item.files.length}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---- department row ---- */}
        <nav className="rcse-switch" aria-label="Departments">
          <ul>
            {switcher.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`rcse-switch__link${item.to === switcher.current ? " is-current" : ""}`}
                  aria-current={item.to === switcher.current ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---- search, tabs, semester chips ---- */}
        <section className="rcse-browser" aria-label="Study resources">
          <div className="rcse-toolbar">
            <div className="rcse-tabs" role="tablist" aria-label="Type of resource" onKeyDown={onTabKey}>
              {tabs.map((item) => {
                const Icon = item.icon || RESOURCE_ICONS[item.id] || FiFileText;
                const active = item.id === tabId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`rcse-tab-${item.id}`}
                    aria-selected={active}
                    aria-controls="rcse-panel"
                    tabIndex={active ? 0 : -1}
                    className={`rcse-tab${active ? " is-active" : ""}`}
                    onClick={() => pickTab(item.id)}
                  >
                    <Icon aria-hidden="true" />
                    {item.label}
                    <span className="rcse-tab__n">{item.files.length}</span>
                  </button>
                );
              })}
            </div>

            <div className="rcse-toolbar__row">
              <label className="rcse-search">
                <FiSearch aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE); }}
                  placeholder={`Search ${tab.label.toLowerCase()}`}
                  aria-label={`Search ${tab.label.toLowerCase()}`}
                />
                {query && (
                  <button type="button" className="rcse-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                    <FiX aria-hidden="true" />
                  </button>
                )}
              </label>
              <p className="rcse-count" aria-live="polite">
                <b>{results.length}</b> {results.length === 1 ? "file" : "files"}
              </p>
            </div>

            {semesters.length > 1 && (
              <div className="rcse-chips" role="group" aria-label="Filter by semester">
                {["all", ...semesters].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`rcse-chip${value === semester ? " is-active" : ""}`}
                    aria-pressed={value === semester}
                    onClick={() => { setSemester(value); setLimit(PAGE_SIZE); }}
                  >
                    {value === "all" ? "All" : semesterLabel(value, tab)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div id="rcse-panel" role="tabpanel" aria-labelledby={`rcse-tab-${tab.id}`} tabIndex={0} className="rcse-panel" key={tab.id}>
            {shown.length > 0 ? (
              <ul className="rcse-files">
                {shown.map((item) => {
                  const type = typeOf(item.file);
                  return (
                    <li key={`${item.file}`}>
                      <div className="rcse-file">
                        <span className={`rcse-file__type rcse-file__type--${type.toLowerCase()}`}>
                          <FiFileText aria-hidden="true" />
                          {type}
                        </span>
                        <span className="rcse-file__text">
                          <strong>{item.name}</strong>
                          <small>{semesterLabel(item.semester, tab)}</small>
                        </span>
                        <span className="rcse-file__actions">
                          <a className="rcse-file__go rcse-file__go--view" href={viewHref(item.file)} target="_blank" rel="noopener noreferrer">
                            <FiEye aria-hidden="true" />
                            View
                            <span className="sr-only"> {item.name} (opens in a new tab)</span>
                          </a>
                          <a className="rcse-file__go" href={studyResourceFileUrl(item.file)} download>
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
              <div className="rcse-none">
                <span className="rcse-none__icon"><FiFileText aria-hidden="true" /></span>
                <h2>{q || semester !== "all" ? "No files found" : "Files coming soon"}</h2>
                <p>{q || semester !== "all" ? "Try another word or choose a different semester." : "These files will be added shortly."}</p>
                {(q || semester !== "all") && (
                  <button type="button" className="rcse-btn" onClick={() => { setQuery(""); setSemester("all"); }}>
                    Show all files
                  </button>
                )}
              </div>
            )}

            {remaining > 0 && (
              <div className="rcse-more">
                <button type="button" className="rcse-btn" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, remaining)} more files
                </button>
                <span>{remaining} more in this view</span>
              </div>
            )}
          </div>
        </section>

        {/* ---- related links ---- */}
        <section className="rcse-related" aria-label="More for students">
          {pageRelated.map((item) =>
            item.external ? (
              <a key={item.label} className="rcse-related__item" href={item.href} target="_blank" rel="noopener noreferrer">
                <span><strong>{item.label}</strong>{item.text}</span>
                <FiArrowUpRight aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <Link key={item.label} className="rcse-related__item" to={item.to}>
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