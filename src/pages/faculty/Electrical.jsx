// Electrical.jsx - Departments > Electrical Engineering (route: /departments/electrical).
// Page order: hero (same as About / Facilities) -> title block + department picture -> department switcher
//             -> search + About / Staff tabs -> department highlights.
// Own styles (Electrical.css, every class starts with "ele-"). Nothing here is shared with another department.
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - everything is a list at the top of this file:
//   dept         title, short introduction, quick facts and the framed department picture
//   collage      the three About pictures: [small left, small right, large below]
//   about        the About sections (first one = the card with the collage, the rest = cards below it)
//   staff        one object per person: name, role, photo, and OPTIONAL qualification / interest / email
//                (empty fields are simply not shown - add them whenever they are available)
//   highlights   the four visual cards at the bottom
// Department and collage photos use /images/faculty/electrical-engineering/; staff photos remain under /images/departments/electrical/staff/.
// A missing picture shows a clean placeholder, a missing staff photo shows the person's initials.
//
//
//   /media/teachers/<file>                    -> public/images/departments/electrical/staff/<file>   (7 photos, file names used below)
//   hero.jpg, about-1.jpg, about-2.jpg, about-3.jpg -> /images/faculty/electrical-engineering/ (department picture and About collage)
//   electrical-highlight-labs.jpg, electrical-highlight-since.jpg, electrical-highlight-results.jpg, electrical-highlight-placements.jpg -> backgrounds of the highlight cards
// The banner /images/pages-banner.png is the same one the About / Facilities pages use.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartment, getDepartments, mediaUrl } from "../../services/departmentService";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiChevronRight, FiMapPin, FiSearch, FiX, FiImage, FiInfo, FiLayers, FiBriefcase, FiMonitor, FiAward,
  FiTrendingUp, FiCheckCircle, FiFileText, FiUsers, FiClock, FiUser, FiCalendar, FiBookOpen, FiMail, FiChevronDown,
} from "react-icons/fi";
import "./Electrical.css";

const IMG = "/images/departments/electrical";
const DEPT_IMG = "/images/faculty/electrical-engineering";

// Same banner as the About / Facilities pages (a patterned navy banner shows if it is missing).
const fallbackBanner = "/images/pages-banner.png";

const fallbackDept = {
  title: "Electrical Engineering",
  titleLine2: "",
  lead: "Power, machines, control and automation - hands-on training for the electrical industry.",
  facts: [
    { icon: FiCalendar, text: "Since 1950" },
    { icon: FiBookOpen, text: "3-year diploma" },
    { icon: FiUsers, text: "60 seats" },
  ],
  image: `${DEPT_IMG}/hero.jpg`,
  imageAlt: "Electrical Engineering department",
};

// All eight departments. Wide screens show them as a row of pills, small screens as a dropdown.
// The same list is repeated in every department file on purpose.
const fallbackSwitcher = [
  { label: "Civil", to: "/departments/civil" },
  { label: "Computer", to: "/departments/computer" },
  { label: "Electrical", to: "/departments/electrical" },
  { label: "Electronics", to: "/departments/electronics" },
  { label: "Mechanical", to: "/departments/mechanical" },
  { label: "Plastic", to: "/departments/plastic" },
  { label: "Applied Sciences", to: "/departments/applied-science" },
  { label: "Workshop", to: "/departments/workshop" },
  { label: "Administrative", to: "/departments/administrative" },
];
const CURRENT = "/departments/electrical";
const fallbackCurrentLabel = fallbackSwitcher.find((item) => item.to === CURRENT)?.label;

// Two small pictures on top, one wide picture below (the layout of the About card).
const fallbackCollage = [
  { src: `${DEPT_IMG}/about-1.jpg`, alt: "Electrical Engineering department - picture 1" },
  { src: `${DEPT_IMG}/about-2.jpg`, alt: "Electrical Engineering department - picture 2" },
  { src: `${DEPT_IMG}/about-3.jpg`, alt: "Electrical Engineering department - picture 3" },
];

// The three small tiles in the About card.
const fallbackAboutTiles = [
  { icon: FiMonitor, value: "11", label: "Laboratories" },
  { icon: FiClock, value: "1950", label: "Established" },
  { icon: FiTrendingUp, value: "75%", label: "Cleared 5th semester" },
];

// view: "text" = paragraphs only, "chips" = items shown as chips, "list" = items shown as a tick list.
// paragraphs come before the items, closing paragraphs after them. The FIRST section sits in the card beside the collage.
const fallbackAbout = [
  {
    id: "intro",
    title: "About the Department",
    icon: FiInfo,
    view: "text",
    paragraphs: [
      "The Department of Electrical Engineering has been a part of the institute since its founding and has consistently played a vital role in shaping skilled professionals for the electrical industry.",
      "The department focuses on providing quality education and skill development in the field of electrical engineering, which covers the study and application of electricity, electronics and computer systems.",
    ],
  },
  {
    id: "overview",
    title: "Department overview",
    icon: FiLayers,
    view: "text",
    paragraphs: [
      "Electrical engineering plays a central role in the generation, transmission and distribution of electric power, and is closely linked with automation and communication systems. The demand for electrical engineers continues to grow with industrial automation and rising energy needs.",
    ],
  },
  {
    id: "jobs",
    title: "Job prospects",
    icon: FiBriefcase,
    view: "chips",
    paragraphs: [
      "Electrical Engineering graduates have employment opportunities in the public and private sectors, such as power generation, railways, civil aviation, defence, utilities, manufacturing and consultancy. Typical job roles include:",
    ],
    items: [
      "Junior Engineer", "Design Engineer", "Quality Control Engineer", "Test Engineer", "Reliability Engineer",
      "Process and Manufacturing Engineer",
    ],
  },
  {
    id: "labs",
    title: "Department laboratories",
    icon: FiMonitor,
    view: "chips",
    wide: true,
    paragraphs: [
      "The department has well-equipped laboratories and workshops for strengthening theoretical knowledge with hands-on practical training. Key labs include:",
    ],
    items: [
      "Electrical Machine Lab", "PEE & Electrical Networks Lab", "Analog & Digital Electronics Lab",
      "Electrical Measurement & Instrumentation Lab", "PLC & Microcontroller Lab", "Power Lab",
      "Industrial Electronics & Drives Lab", "Installation & Maintenance Lab", "Energy Conservation & Audit Lab",
      "Programming Skills Lab", "Basic Electrical Workshop",
    ],
  },
  {
    id: "placements",
    title: "Placement status",
    icon: FiAward,
    view: "list",
    paragraphs: [
      "The department reports good placement results for the eligible final-year students of the 2022-25 batch:",
    ],
    items: [
      "12 students joined Motherson Sumi Systems Ltd.",
      "13 students joined Syrma SGS Technology Ltd.",
      "The remaining students chose to pursue higher education.",
    ],
  },
  {
    id: "academic",
    title: "Academic performance",
    icon: FiTrendingUp,
    view: "list",
    paragraphs: [
      "The academic performance of students is a key focus area for the department. The academic record of students reflects their achievements:",
    ],
    items: [
      "75% of students cleared the 5th semester.",
      "Top performers: Rahul Sharma (89.9%), Ankit Kumar (88.6%) and Prabhat Kumar (85.5%).",
    ],
    closing: [
      "The department continues to improve academic results through interactive teaching, hands-on laboratory exposure, remedial classes, workshops and individual mentoring.",
    ],
  },
  {
    id: "activities",
    title: "Co-curricular activities and industry interface",
    icon: FiUsers,
    view: "list",
    wide: true,
    paragraphs: [
      "Students are encouraged to take part in technical quizzes, presentations, project exhibitions and industrial visits. The department also arranges expert lectures, workshops and seminars with industry professionals to connect classroom learning with industry practice. Activities in 2024-25 included:",
    ],
    items: [
      "Industrial visit to the MSME Technology Center, Rohtak - PLC applications and Electrical CAD",
      "Visit to a power house - power system protection",
      "Expert lecture on personality development",
    ],
    closing: [
      "These activities build technical knowledge, soft skills, teamwork and problem-solving ability.",
    ],
  },
];

// One object per person (REAL data from each person's page on the live website).
// interest is empty for everyone on the live site, so that row is hidden until you fill it in. email shows as a mailto link
const fallbackStaff = [
  { name: "Mr Parveen Dahiya", role: "Senior Lecturer", photo: `${IMG}/staff/parveen-dahiya.jpeg`, qualification: "B.E", interest: "" },
  { name: "Mr K.K. Bisla", role: "Lecturer", photo: `${IMG}/staff/kk-bisla.jpeg`, qualification: "B.E", interest: "", email: "krishanbisla@yahoo.co.in" },
  { name: "Mr Hans Raj", role: "Lecturer", photo: `${IMG}/staff/hans-raj.jpeg`, qualification: "B.E", interest: "", email: "thakranhansraj@yahoo.com" },
  { name: "Mr. Saket Bhatnagar", role: "Workshop Instructor", photo: `${IMG}/staff/saket-bhatnagar.jpeg`, qualification: "Diploma", interest: "", email: "saketbhatnagar001@gmail.com" },
  { name: "Mr. Sandeep Kumar", role: "Lab Instructor", photo: `${IMG}/staff/sandeep-kumar.jpeg`, qualification: "Diploma in Elect. Engg.", interest: "", email: "sandeepkumar@crpolytechnic.org" },
  { name: "Sh. Suresh Lather", role: "Workshop Instructor", photo: `${IMG}/staff/suresh_lather.jpg`, qualification: "B.Tech", interest: "", email: "lathersureshcr@gmail.com" },
  { name: "Sh. Jai Bhagwan", role: "Workshop Instructor", photo: `${IMG}/staff/jai_bhagwan.jpg`, qualification: "ITI", interest: "" },
];

// Four visual cards, real facts from this department's page only.
const fallbackHighlights = [
  {
    icon: FiMonitor, value: "11", label: "Laboratories", image: `${IMG}/electrical-highlight-labs.jpg`,
    text: "Electrical Machine, PLC & Microcontroller, Power, Industrial Electronics & Drives and more.",
  },
  {
    icon: FiClock, value: "1950", label: "Established", image: `${IMG}/electrical-highlight-since.jpg`,
    text: "Part of the institute since its founding, shaping skilled professionals for the electrical industry.",
  },
  {
    icon: FiTrendingUp, value: "75%", label: "Cleared 5th semester", image: `${IMG}/electrical-highlight-results.jpg`,
    text: "Top performer Rahul Sharma scored 89.9%.",
  },
  {
    icon: FiBriefcase, value: "25", label: "Students placed", image: `${IMG}/electrical-highlight-placements.jpg`,
    text: "12 joined Motherson Sumi Systems Ltd. and 13 joined Syrma SGS Technology Ltd. (2022-25 batch).",
  },
];

// ---------------------------------------------------------------------------------------------

const initials = (name) =>
  name
    .replace(/^(dr|mr|ms|mrs|er)\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

// Wraps the searched word in <mark> so it is easy to spot.
function Mark({ text, query }) {
  if (!query) return text;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.split(new RegExp(`(${safe})`, "ig")).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part,
  );
}

// One picture with a placeholder when the file is missing.
function Photo({ src, alt, className = "", placeholder = "Photo coming soon" }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`ele-photo ${className}`}>
      {failed || !src ? (
        <div className="ele-photo__empty" aria-hidden="true">
          <FiImage />
          <span>{placeholder}</span>
        </div>
      ) : (
        <img src={mediaUrl(src)} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      )}
    </figure>
  );
}

function Avatar({ person, placeholder = "Photo coming soon" }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="ele-avatar">
      {failed || !person.photo ? (
        <span aria-hidden="true">{placeholder}</span>
      ) : (
        <img src={mediaUrl(person.photo)} alt={person.name} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

// Keeps only the parts of a section that contain the searched word (the whole section if its heading matches).
function filterSection(section, q) {
  if (!q) return section;
  const has = (text) => text.toLowerCase().includes(q);
  if (has(section.title)) return section;
  const paragraphs = (section.paragraphs || []).filter(has);
  const items = (section.items || []).filter(has);
  const closing = (section.closing || []).filter(has);
  if (!paragraphs.length && !items.length && !closing.length) return null;
  return { ...section, paragraphs, items, closing };
}

export default function Electrical() {
  const [serverData, setServerData] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(fallbackSwitcher);
  useEffect(() => {
    let active = true;
    getDepartment("electrical").then((data) => { if (active) setServerData(data); }).catch(() => {});
    getDepartments().then((list) => {
      if (active && Array.isArray(list) && list.length) setDepartmentOptions(list.slice().sort((a, b) => a.order - b.order).map((item) => ({ label: item.shortName, to: `/departments/${item.slug}`, slug: item.slug })));
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const fallbackLabels = {
    eyebrow: "Department", bannerTagLeft: "Government Polytechnic", bannerTagRight: "Rohtak (Haryana)", breadcrumb: "Electrical", switcherLabel: "Department", aboutTab: "About", staffTab: "Staff", searchAbout: "Search the department information", searchStaff: "Search staff by name or role", qualificationLabel: "Qualification", interestLabel: "Interested area", highlightsEyebrow: "At a glance", highlightsTitle: "Department", highlightsTitleHighlight: "highlights", photoPlaceholder: "Photo coming soon", };
  const pageLabels = Object.fromEntries(Object.entries({ ...fallbackLabels, ...(serverData?.labels || {}) }).map(([key, value]) => [key, value || fallbackLabels[key]]));
  const banner = mediaUrl(serverData?.banner || fallbackBanner);
  const dept = serverData ? { ...fallbackDept, ...serverData, facts: (serverData.facts || []).map((item, i) => ({ ...item, icon: fallbackDept.facts[i]?.icon || fallbackDept.facts[0]?.icon })), image: mediaUrl(serverData.image ?? fallbackDept.image) } : fallbackDept;
  const collage = serverData ? (serverData.collage || []).map((item) => ({ ...item, src: mediaUrl(item.src) })) : fallbackCollage;
  const aboutTiles = serverData ? (serverData.tiles || []).map((item, i) => ({ ...item, icon: fallbackAboutTiles[i]?.icon || fallbackAboutTiles[0]?.icon })) : fallbackAboutTiles;
  const about = serverData ? (serverData.about || []).map((item, i) => ({ ...item, icon: fallbackAbout[i]?.icon || fallbackAbout[0]?.icon })) : fallbackAbout;
  const staff = (serverData?.staff || fallbackStaff).filter((person) => [person.name, person.role, person.photo, person.qualification, person.interest, person.email].some(Boolean));
  const highlights = serverData ? (serverData.highlights || []).map((item, i) => ({ ...item, image: mediaUrl(item.image), icon: fallbackHighlights[i]?.icon || fallbackHighlights[0]?.icon })) : fallbackHighlights;
  const switcher = departmentOptions;
  const currentLabel = switcher.find((item) => item.slug === "electrical" || item.to === CURRENT)?.label || fallbackCurrentLabel;

  const [tab, setTab] = useState("about");
  const [query, setQuery] = useState("");
  const tabRefs = useRef({});
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const q = query.trim().toLowerCase();

  // The department dropdown (small screens) closes when you click outside it or press Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const pickTab = (id, focus = false) => {
    setTab(id);
    setQuery("");
    if (focus) tabRefs.current[id]?.focus();
  };

  const onTabKey = (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      pickTab(tab === "about" ? "staff" : "about", true);
    }
  };

  // Without a search the first section is the collage card; with a search every section is a normal card.
  const [feature, ...rest] = about;
  const sections = (q ? about : rest).map((section) => filterSection(section, q)).filter(Boolean);
  const people = staff.filter((person) =>
    !q || [person.name, person.role, person.qualification, person.interest].filter(Boolean).join(" ").toLowerCase().includes(q),
  );

  return (
    <main id="main" className="ele-page">
      {/* ---- hero (same as About us / Facilities) ---- */}
      <section className="ele-hero" aria-label="Electrical Engineering department" style={{ "--img": `url("${banner}")` }}>
        <div className="ele-hero__photo" />
        <div className="ele-hero__tags">
          <span className="ele-hero__tag ele-hero__tag--left">
            <span className="ele-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {pageLabels.bannerTagLeft}
          </span>
          <span className="ele-hero__tag ele-hero__tag--right">
            <span className="ele-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {pageLabels.bannerTagRight}
          </span>
        </div>
        <nav className="ele-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Departments</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabels.breadcrumb}</span>
        </nav>
      </section>

      <div className="container ele-wrap">
        {/* ---- title block + department picture ---- */}
        <header className="ele-top">
          <div className="ele-top__text">
            <span className="ele-eyebrow">{pageLabels.eyebrow}</span>
            <h1>{dept.title}{dept.titleLine2 && <span>{dept.titleLine2}</span>}</h1>
            <p>{dept.lead}</p>
            <ul className="ele-facts">
              {dept.facts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <li key={fact.text}>
                    <Icon aria-hidden="true" />
                    {fact.text}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="ele-frame">
            <Photo src={dept.image} alt={dept.imageAlt} className="ele-frame__photo" placeholder={pageLabels.photoPlaceholder} />
          </div>
        </header>

        {/* ---- department switcher: pills on wide screens, a dropdown on small screens ---- */}
        <nav className="ele-switch" aria-label="Departments">
          <ul className="ele-switch__list">
            {switcher.map((item) => {
              const isCurrent = item.slug === "electrical" || item.to === CURRENT;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`ele-switch__link${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ele-switch__menu" ref={menuRef}>
            <button
              type="button"
              className="ele-switch__button"
              aria-expanded={menuOpen}
              aria-controls="ele-switch-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="ele-switch__label">{pageLabels.switcherLabel}</span>
              <span className="ele-switch__current">{currentLabel}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            {menuOpen && (
              <ul id="ele-switch-panel" className="ele-switch__panel">
                {switcher.map((item) => {
                  const isCurrent = item.slug === "electrical" || item.to === CURRENT;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`ele-switch__link${isCurrent ? " is-current" : ""}`}
                        aria-current={isCurrent ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </nav>

        {/* ---- search + tabs ---- */}
        <section className="ele-info" aria-label="Department information">
          <div className="ele-toolbar">
            <label className="ele-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
                aria-label={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
              />
              {query && (
                <button type="button" className="ele-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="ele-tabs" role="tablist" aria-label="Department sections" onKeyDown={onTabKey}>
              <button
                ref={(el) => { tabRefs.current.about = el; }}
                type="button" role="tab" id="ele-tab-about" aria-selected={tab === "about"} aria-controls="ele-panel"
                tabIndex={tab === "about" ? 0 : -1} className={`ele-tab${tab === "about" ? " is-active" : ""}`} onClick={() => pickTab("about")}
              >
                <FiFileText aria-hidden="true" /> {pageLabels.aboutTab || "About"}
              </button>
              <button
                ref={(el) => { tabRefs.current.staff = el; }}
                type="button" role="tab" id="ele-tab-staff" aria-selected={tab === "staff"} aria-controls="ele-panel"
                tabIndex={tab === "staff" ? 0 : -1} className={`ele-tab${tab === "staff" ? " is-active" : ""}`} onClick={() => pickTab("staff")}
              >
                <FiUsers aria-hidden="true" /> {pageLabels.staffTab || "Staff"} <span className="ele-tab__n">{staff.length}</span>
              </button>
            </div>
          </div>

          <div id="ele-panel" className="ele-panel" role="tabpanel" aria-labelledby={`ele-tab-${tab}`} tabIndex={0}>
            {tab === "about" ? (
              <>
                {!q && feature && (
                  <article className="ele-feature">
                    <div className="ele-collage">
                      <Photo src={collage[0].src} alt={collage[0].alt} className="ele-collage__a" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[1].src} alt={collage[1].alt} className="ele-collage__b" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[2].src} alt={collage[2].alt} className="ele-collage__c" placeholder={pageLabels.photoPlaceholder} />
                    </div>
                    <div className="ele-feature__text">
                      <span className="ele-feature__bar" aria-hidden="true" />
                      <h2>{feature.title}</h2>
                      {feature.paragraphs.map((text) => <p key={text}>{text}</p>)}
                      <ul className="ele-tiles">
                        {aboutTiles.map((tile) => {
                          const Icon = tile.icon;
                          return (
                            <li key={tile.label}>
                              <Icon aria-hidden="true" />
                              <strong>{tile.value}</strong>
                              <span>{tile.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </article>
                )}

                {sections.length > 0 ? (
                  <div className="ele-about">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <article key={section.id} className={`ele-block${section.wide ? " ele-block--wide" : ""}`}>
                          <h2><span className="ele-block__icon"><Icon aria-hidden="true" /></span><Mark text={section.title} query={q} /></h2>
                          {section.paragraphs?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                          {section.items?.length > 0 && (
                            <ul className={`ele-items ele-items--${section.view}`}>
                              {section.items.map((item) => (
                                <li key={item}>
                                  {section.view === "list" && <FiCheckCircle aria-hidden="true" />}
                                  <span><Mark text={item} query={q} /></span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {section.closing?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="ele-none">Nothing found for "{query}". Try another word.</p>
                )}
              </>
            ) : people.length > 0 ? (
              <ul className="ele-staff">
                {people.map((person) => (
                  <li key={person.name} className="ele-card">
                    <Avatar person={person} placeholder={pageLabels.photoPlaceholder} />
                    <div className="ele-card__body">
                      <h3><Mark text={person.name} query={q} /></h3>
                      {person.role && <span className="ele-card__role"><Mark text={person.role} query={q} /></span>}
                      <dl>
                        {person.qualification && (
                        <div>
                          <dt>{pageLabels.qualificationLabel || "Qualification"}</dt>
                          <dd><Mark text={person.qualification} query={q} /></dd>
                        </div>
                        )}
                        {/* qualification is omitted when empty */}
                        {person.interest && (
                          <div>
                            <dt>{pageLabels.interestLabel || "Interested area"}</dt>
                            <dd><Mark text={person.interest} query={q} /></dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    {person.email && (
                      <a className="ele-card__mail" href={`mailto:${person.email}`}>
                        <FiMail aria-hidden="true" />
                        <span>{person.email}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ele-none">No staff found for "{query}". Try another name or role.</p>
            )}
          </div>
        </section>

        {/* ---- department highlights ---- */}
        <section className="ele-highlights" aria-labelledby="ele-hl-title">
          <header className="ele-head">
            <span className="ele-eyebrow ele-eyebrow--line">{pageLabels.highlightsEyebrow || "At a glance"}</span>
            <h2 id="ele-hl-title">{pageLabels.highlightsTitle || "Department"} <span>{pageLabels.highlightsTitleHighlight || "highlights"}</span></h2>
          </header>
          <ul className="ele-hl">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="ele-hl__card" style={{ "--hl-img": `url("${mediaUrl(item.image)}")` }}>
                  <div className="ele-hl__top">
                    <span className="ele-hl__icon"><Icon aria-hidden="true" /></span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="ele-hl__label">{item.label}</span>
                  <p>{item.text}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}