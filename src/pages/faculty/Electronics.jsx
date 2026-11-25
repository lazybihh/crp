// Electronics.jsx - Departments > Electronics & Communication Engineering (route: /departments/electronics).
// Page order: hero (same as About / Facilities) -> title block + department picture -> department switcher
//             -> search + About / Staff tabs -> department highlights.
// Own styles (Electronics.css, every class starts with "ece-"). Nothing here is shared with another department.
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - everything is a list at the top of this file:
//   dept         title, short introduction, quick facts and the framed department picture
//   collage      the three About pictures: [small left, small right, large below]
//   about        the About sections (first one = the card with the collage, the rest = cards below it)
//   staff        one object per person: name, role, photo, and OPTIONAL qualification / interest / email
//                (empty fields are simply not shown - add them whenever they are available)
//   highlights   the four visual cards at the bottom
// Department and collage photos use /images/faculty/electronics-communication/; staff photos remain under /images/departments/electronics/staff/.
// A missing picture shows a clean placeholder, a missing staff photo shows the person's initials.
//
//   /media/teachers/<file>   -> public/images/departments/electronics/staff/<file>   (photo file names used in the staff list below)
//   hero.jpg, about-1.jpg, about-2.jpg, about-3.jpg -> /images/faculty/electronics-communication/ (department picture and About collage)
//   electronics-highlight-*.jpg (4 files named in the highlights list) -> backgrounds of the highlight cards
// The banner /images/pages-banner.png is the same one the About / Facilities pages use.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartment, getDepartments, mediaUrl } from "../../services/departmentService";
import PageLoader, { usePageReady } from "../../components/PageLoader";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiChevronRight, FiMapPin, FiSearch, FiX, FiImage, FiInfo, FiBriefcase, FiAward, FiTrendingUp, FiCheckCircle,
  FiFileText, FiUsers, FiUser, FiCalendar, FiBookOpen, FiMail, FiChevronDown,
} from "react-icons/fi";
import "./Electronics.css";

const IMG = "/images/departments/electronics";
const DEPT_IMG = "/images/faculty/electronics-communication";

// Same banner as the About / Facilities pages (a patterned navy banner shows if it is missing).
const fallbackBanner = "/images/pages-banner.png";

const fallbackDept = {
  title: "Electronics & Communication",
  titleLine2: "Engineering",
  lead: "Electronics, communication and related technologies - a strong academic and practical foundation for industry.",
  facts: [
    { icon: FiBookOpen, text: "3-year diploma" },
    { icon: FiUsers, text: "54 seats" },
    { icon: FiCalendar, text: "Annual placement drive" },
  ],
  image: `${DEPT_IMG}/hero.jpg`,
  imageAlt: "Electronics & Communication Engineering department",
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
const CURRENT = "/departments/electronics";
const fallbackCurrentLabel = fallbackSwitcher.find((item) => item.to === CURRENT)?.label;

// Two small pictures on top, one wide picture below (the layout of the About card).
const fallbackCollage = [
  { src: `${DEPT_IMG}/about-1.jpg`, alt: "Electronics & Communication Engineering department - picture 1" },
  { src: `${DEPT_IMG}/about-2.jpg`, alt: "Electronics & Communication Engineering department - picture 2" },
  { src: `${DEPT_IMG}/about-3.jpg`, alt: "Electronics & Communication Engineering department - picture 3" },
];

// The three small tiles in the About card.
const fallbackAboutTiles = [
  { icon: FiBriefcase, value: "9", label: "Recruiters" },
  { icon: FiAward, value: "10", label: "Placed in 2021-22" },
  { icon: FiTrendingUp, value: "84.5%", label: "Top academic score" },
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
      "The Department of Electronics & Communication Engineering aims to give students a strong academic and practical foundation in electronics, communication and related technologies.",
      "The department focuses on technical competence, innovation and problem-solving. It promotes hands-on learning, research orientation and professional development to prepare students for the demands of industry.",
    ],
  },
  {
    id: "recruiters",
    title: "Our recruiters",
    icon: FiBriefcase,
    view: "chips",
    paragraphs: [
      "Many students of the department have joined well-known technical companies, including:",
    ],
    items: [
      "Motherson Sumi Pvt. Ltd.", "Tech Mahindra", "VVDN Manesar", "Ambar Enterprises Ltd.", "Alpex Solar Ltd.",
      "Aditya Birla Pvt. Ltd.", "Airtel Ltd.", "Micron Pvt. Ltd.", "Wipro Pvt. Ltd.",
    ],
  },
  {
    id: "toppers",
    title: "Academic toppers",
    icon: FiTrendingUp,
    view: "list",
    paragraphs: [
      "The academic record of students reflects their achievements:",
    ],
    items: [
      "Ranjan Kumar (Batch 2019) - 80.45%, Network Engineer at Airtel Pvt. Ltd.",
      "Anisha Hooda (Batch 2020) - 84.5%, pursuing B.Tech at Guru Jambheshwar University of Science and Technology, Hisar",
      "Ritu (Batch 2021) - 83.2%, campus placement at Aditya Birla, Panipat",
    ],
  },
  {
    id: "placements",
    title: "Placement status",
    icon: FiAward,
    view: "list",
    wide: true,
    paragraphs: [
      "An on-campus placement drive is held every year for final-year students, connecting them with private sector organizations.",
    ],
    items: [
      "Batch 2022: Yash Kumar - Motherson Sumi Ltd.",
      "Batch 2022: Kishan - Motherson Sumi Ltd.",
      "Batch 2022: Rohan Kumar - Motherson Sumi Ltd.",
      "Batch 2022: Deepak Kumar - Motherson Sumi Ltd.",
      "Batch 2021: Harsh - VVDN, Manesar",
      "Batch 2021: Ashutosh Kumar Anand - VVDN, Manesar",
      "Batch 2021: Gaurav - Motherson Sumi Ltd. and Ambar Enterprises Ltd.",
      "Batch 2021: Ritu - Aditya Birla, Panipat",
      "Batch 2021: Tanvi Jha - Alpex Solar Ltd., Greater Noida",
      "Batch 2021: Parvesh - VVDN, Manesar",
    ],
  },
  {
    id: "activities",
    title: "Activities and industry exposure",
    icon: FiUsers,
    view: "list",
    wide: true,
    paragraphs: [
      "The department prepares students for industry through:",
    ],
    items: [
      "Workshops and expert sessions on emerging technologies and industry trends",
      "Team-based student projects, supported by a project laboratory",
      "An institute-wide project exhibition - projects are judged on originality, practical application and creativity",
      "Industrial visits giving first-hand exposure to industry practices",
      "The annual campus placement drive",
    ],
  },
];

// One object per person (REAL data from each person's page on the live website).
// interest is empty for everyone on the live site, so that row is hidden until you fill it in. email shows as a mailto link
const fallbackStaff = [
  { name: "Mr. Jai Kanwar", role: "Head of Department", photo: `${IMG}/staff/jai-kanwar.jpeg`, qualification: "B.E", interest: "", email: "jaiatulantil@yahoo.co.in" },
  { name: "Dr Sukhbir Singh Kinha", role: "Senior Lecturer", photo: `${IMG}/staff/23434_s2P8s6Q.jpg`, qualification: "B.E.(Hons), M.E.,PhD", interest: "", email: "sukhbirkinha@gmail.com" },
  { name: "Dr. Sitender Kumar", role: "Lecturer", photo: `${IMG}/staff/sitender-kumar.jpeg`, qualification: "BE,MS,Phd.", interest: "", email: "dr.pawadia@gmail.com" },
  { name: "Mr. Navinder Malik", role: "Lecturer", photo: `${IMG}/staff/navinder-malik.jpeg`, qualification: "B.Tech", interest: "", email: "navindermalik@yahoo.com" },
  { name: "Mr. Alok Kumar", role: "Lecturer", photo: `${IMG}/staff/alok-kumar.jpeg`, qualification: "B.E", interest: "", email: "alok_kumar_619@yahoo.com" },
  { name: "Ms. Ashima Singh", role: "Lecturer", photo: `${IMG}/staff/ashima-singh.jpeg`, qualification: "B.Tech in E.C.E", interest: "", email: "ashima.singh.hooda9@gmail.com" },
  { name: "Mr. Manoj Takshak", role: "Lab Instructor", photo: `${IMG}/staff/manoj-takshak.jpeg`, qualification: "B.E", interest: "", email: "takshakm@gmail.com" },
  { name: "Sh. Suresh Nehra", role: "Workshop Instructor", photo: `${IMG}/staff/suresh-nehra_SKf7hQ9.jpeg`, qualification: "B.Tech", interest: "", email: "satyarth70@gmail.com" },
];

// Four visual cards, real facts from this department's page only.
const fallbackHighlights = [
  {
    icon: FiBriefcase, value: "9", label: "Recruiters", image: `${IMG}/electronics-highlight-recruiters.jpg`,
    text: "Motherson Sumi, Tech Mahindra, VVDN, Wipro, Airtel, Micron and more.",
  },
  {
    icon: FiAward, value: "10", label: "Students placed", image: `${IMG}/electronics-highlight-placements.jpg`,
    text: "Campus placements of the 2021 and 2022 batches (4 students in 2022, 6 in 2021).",
  },
  {
    icon: FiTrendingUp, value: "84.5%", label: "Top academic score", image: `${IMG}/electronics-highlight-results.jpg`,
    text: "Anisha Hooda (Batch 2020) went on to B.Tech at Guru Jambheshwar University, Hisar.",
  },
  {
    icon: FiUsers, value: "54", label: "Seats", image: `${IMG}/electronics-highlight-seats.jpg`,
    text: "A three-year diploma in Electronics & Communication Engineering.",
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
    <figure className={`ece-photo ${className}`}>
      {failed || !src ? (
        <div className="ece-photo__empty" aria-hidden="true">
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
    <div className="ece-avatar">
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

export default function Electronics() {
  const { ready, data: results } = usePageReady(() => Promise.allSettled([getDepartment("electronics"), getDepartments()]));
  const serverData = results?.[0]?.status === "fulfilled" ? results[0].value : null;
  const departmentList = results?.[1]?.status === "fulfilled" ? results[1].value : null;
  const departmentOptions = Array.isArray(departmentList) && departmentList.length
    ? departmentList.slice().sort((a, b) => a.order - b.order).map((item) => ({ label: item.shortName, to: `/departments/${item.slug}`, slug: item.slug }))
    : fallbackSwitcher;
  const fallbackLabels = {
    eyebrow: "Department", bannerTagLeft: "Government Polytechnic", bannerTagRight: "Rohtak (Haryana)", breadcrumb: "Electronics", switcherLabel: "Department", aboutTab: "About", staffTab: "Staff", searchAbout: "Search the department information", searchStaff: "Search staff by name or role", qualificationLabel: "Qualification", interestLabel: "Interested area", highlightsEyebrow: "At a glance", highlightsTitle: "Department", highlightsTitleHighlight: "highlights", photoPlaceholder: "Photo coming soon", };
  const pageLabels = Object.fromEntries(Object.entries({ ...fallbackLabels, ...(serverData?.labels || {}) }).map(([key, value]) => [key, value || fallbackLabels[key]]));
  const banner = mediaUrl(serverData?.banner || fallbackBanner);
  const dept = serverData ? { ...fallbackDept, ...serverData, facts: (serverData.facts || []).map((item, i) => ({ ...item, icon: fallbackDept.facts[i]?.icon || fallbackDept.facts[0]?.icon })), image: mediaUrl(serverData.image ?? fallbackDept.image) } : fallbackDept;
  const collage = serverData ? (serverData.collage || []).map((item) => ({ ...item, src: mediaUrl(item.src) })) : fallbackCollage;
  const aboutTiles = serverData ? (serverData.tiles || []).map((item, i) => ({ ...item, icon: fallbackAboutTiles[i]?.icon || fallbackAboutTiles[0]?.icon })) : fallbackAboutTiles;
  const about = serverData ? (serverData.about || []).map((item, i) => ({ ...item, icon: fallbackAbout[i]?.icon || fallbackAbout[0]?.icon })) : fallbackAbout;
  const staff = (serverData?.staff || fallbackStaff).filter((person) => [person.name, person.role, person.photo, person.qualification, person.interest, person.email].some(Boolean));
  const highlights = serverData ? (serverData.highlights || []).map((item, i) => ({ ...item, image: mediaUrl(item.image), icon: fallbackHighlights[i]?.icon || fallbackHighlights[0]?.icon })) : fallbackHighlights;
  const switcher = departmentOptions;
  const currentLabel = switcher.find((item) => item.slug === "electronics" || item.to === CURRENT)?.label || fallbackCurrentLabel;

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

  if (!ready) return <main id="main" className="ece-page"><PageLoader /></main>;

  return (
    <main id="main" className="ece-page">
      {/* ---- hero (same as About us / Facilities) ---- */}
      <section className="ece-hero" aria-label="Electronics & Communication Engineering department" style={{ "--img": `url("${banner}")` }}>
        <div className="ece-hero__photo" />
        <div className="ece-hero__tags">
          <span className="ece-hero__tag ece-hero__tag--left">
            <span className="ece-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {pageLabels.bannerTagLeft}
          </span>
          <span className="ece-hero__tag ece-hero__tag--right">
            <span className="ece-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {pageLabels.bannerTagRight}
          </span>
        </div>
        <nav className="ece-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Departments</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabels.breadcrumb}</span>
        </nav>
      </section>

      <div className="container ece-wrap">
        {/* ---- title block + department picture ---- */}
        <header className="ece-top">
          <div className="ece-top__text">
            <span className="ece-eyebrow">{pageLabels.eyebrow}</span>
            <h1><span>{dept.title}</span>{dept.titleLine2 && <span>{dept.titleLine2}</span>}</h1>
            <p>{dept.lead}</p>
            <ul className="ece-facts">
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
          <div className="ece-frame">
            <Photo src={dept.image} alt={dept.imageAlt} className="ece-frame__photo" placeholder={pageLabels.photoPlaceholder} />
          </div>
        </header>

        {/* ---- department switcher: pills on wide screens, a dropdown on small screens ---- */}
        <nav className="ece-switch" aria-label="Departments">
          <ul className="ece-switch__list">
            {switcher.map((item) => {
              const isCurrent = item.slug === "electronics" || item.to === CURRENT;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`ece-switch__link${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ece-switch__menu" ref={menuRef}>
            <button
              type="button"
              className="ece-switch__button"
              aria-expanded={menuOpen}
              aria-controls="ece-switch-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="ece-switch__label">{pageLabels.switcherLabel}</span>
              <span className="ece-switch__current">{currentLabel}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            {menuOpen && (
              <ul id="ece-switch-panel" className="ece-switch__panel">
                {switcher.map((item) => {
                  const isCurrent = item.slug === "electronics" || item.to === CURRENT;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`ece-switch__link${isCurrent ? " is-current" : ""}`}
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
        <section className="ece-info" aria-label="Department information">
          <div className="ece-toolbar">
            <label className="ece-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
                aria-label={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
              />
              {query && (
                <button type="button" className="ece-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="ece-tabs" role="tablist" aria-label="Department sections" onKeyDown={onTabKey}>
              <button
                ref={(el) => { tabRefs.current.about = el; }}
                type="button" role="tab" id="ece-tab-about" aria-selected={tab === "about"} aria-controls="ece-panel"
                tabIndex={tab === "about" ? 0 : -1} className={`ece-tab${tab === "about" ? " is-active" : ""}`} onClick={() => pickTab("about")}
              >
                <FiFileText aria-hidden="true" /> {pageLabels.aboutTab || "About"}
              </button>
              <button
                ref={(el) => { tabRefs.current.staff = el; }}
                type="button" role="tab" id="ece-tab-staff" aria-selected={tab === "staff"} aria-controls="ece-panel"
                tabIndex={tab === "staff" ? 0 : -1} className={`ece-tab${tab === "staff" ? " is-active" : ""}`} onClick={() => pickTab("staff")}
              >
                <FiUsers aria-hidden="true" /> {pageLabels.staffTab || "Staff"} <span className="ece-tab__n">{staff.length}</span>
              </button>
            </div>
          </div>

          <div id="ece-panel" className="ece-panel" role="tabpanel" aria-labelledby={`ece-tab-${tab}`} tabIndex={0}>
            {tab === "about" ? (
              <>
                {!q && feature && (
                  <article className="ece-feature">
                    <div className="ece-collage">
                      <Photo src={collage[0].src} alt={collage[0].alt} className="ece-collage__a" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[1].src} alt={collage[1].alt} className="ece-collage__b" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[2].src} alt={collage[2].alt} className="ece-collage__c" placeholder={pageLabels.photoPlaceholder} />
                    </div>
                    <div className="ece-feature__text">
                      <span className="ece-feature__bar" aria-hidden="true" />
                      <h2>{feature.title}</h2>
                      {feature.paragraphs.map((text) => <p key={text}>{text}</p>)}
                      <ul className="ece-tiles">
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
                  <div className="ece-about">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <article key={section.id} className={`ece-block${section.wide ? " ece-block--wide" : ""}`}>
                          <h2><span className="ece-block__icon"><Icon aria-hidden="true" /></span><Mark text={section.title} query={q} /></h2>
                          {section.paragraphs?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                          {section.items?.length > 0 && (
                            <ul className={`ece-items ece-items--${section.view}`}>
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
                  <p className="ece-none">Nothing found for "{query}". Try another word.</p>
                )}
              </>
            ) : people.length > 0 ? (
              <ul className="ece-staff">
                {people.map((person) => (
                  <li key={person.name} className="ece-card">
                    <Avatar person={person} placeholder={pageLabels.photoPlaceholder} />
                    <div className="ece-card__body">
                      <h3><Mark text={person.name} query={q} /></h3>
                      {person.role && <span className="ece-card__role"><Mark text={person.role} query={q} /></span>}
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
                      <a className="ece-card__mail" href={`mailto:${person.email}`}>
                        <FiMail aria-hidden="true" />
                        <span>{person.email}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ece-none">No staff found for "{query}". Try another name or role.</p>
            )}
          </div>
        </section>

        {/* ---- department highlights ---- */}
        <section className="ece-highlights" aria-labelledby="ece-hl-title">
          <header className="ece-head">
            <span className="ece-eyebrow ece-eyebrow--line">{pageLabels.highlightsEyebrow || "At a glance"}</span>
            <h2 id="ece-hl-title">{pageLabels.highlightsTitle || "Department"} <span>{pageLabels.highlightsTitleHighlight || "highlights"}</span></h2>
          </header>
          <ul className="ece-hl">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="ece-hl__card" style={{ "--hl-img": `url("${mediaUrl(item.image)}")` }}>
                  <div className="ece-hl__top">
                    <span className="ece-hl__icon"><Icon aria-hidden="true" /></span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="ece-hl__label">{item.label}</span>
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