// Computer.jsx - Departments > Computer Engineering (route: /departments/computer).
// Page order: hero (same as About / Facilities) -> title block + department picture -> department switcher
//             -> search + About / Staff tabs -> department highlights.
// Own styles (Computer.css, every class starts with "cse-"). Nothing here is shared with another department.
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - everything is a list at the top of this file:
//   dept         title, short introduction, quick facts and the framed department picture
//   collage      the three About pictures: [small left, small right, large below]
//   about        the About sections (first one = the card with the collage, the rest = cards below it)
//   staff        one object per person: name, role, photo, and OPTIONAL qualification / interest
//                (empty fields are simply not shown - add them whenever they are available)
//   highlights   the four visual cards at the bottom
// Department and collage photos use /images/faculty/computer-engineering/; staff photos remain under /images/departments/computer/staff/.
// A missing picture shows a clean placeholder, a missing staff photo shows the person's initials.
//
//   /media/teachers/<name>.jpeg               -> public/images/departments/computer/staff/<name>.jpeg   (9 photos, names used below)
//   hero.jpg, about-1.jpg, about-2.jpg, about-3.jpg -> /images/faculty/computer-engineering/ (department picture and About collage)
//   highlight-labs.jpg, highlight-since.jpg, highlight-results.jpg, highlight-placements.jpg -> backgrounds of the highlight cards
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartment, getDepartments, mediaUrl } from "../../services/departmentService";
import PageLoader, { usePageReady } from "../../components/PageLoader";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiChevronRight, FiMapPin, FiSearch, FiX, FiImage, FiInfo, FiLayers, FiBriefcase, FiMonitor, FiAward,
  FiTrendingUp, FiCheckCircle, FiFileText, FiUsers, FiClock, FiUser, FiCalendar, FiBookOpen, FiMail, FiChevronDown,
} from "react-icons/fi";
import "./Computer.css";

const IMG = "/images/departments/computer";
const DEPT_IMG = "/images/faculty/computer-engineering";

// Same banner as the About / Facilities pages (a patterned navy banner shows if it is missing).
const fallbackBanner = "/images/campus-2.jpg";

const fallbackDept = {
  title: "Computer Engineering",
  titleLine2: "",
  lead: "Software, hardware, networking, robotics and artificial intelligence - hands-on training for the IT industry.",
  facts: [
    { icon: FiCalendar, text: "Established 1998" },
    { icon: FiBookOpen, text: "3-year diploma" },
    { icon: FiUsers, text: "54 seats" },
  ],
  image: `${DEPT_IMG}/hero.jpg`,
  imageAlt: "Computer Engineering department",
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
const CURRENT = "/departments/computer";
const fallbackCurrentLabel = fallbackSwitcher.find((item) => item.to === CURRENT)?.label;

// Two small pictures on top, one wide picture below (the layout of the About card).
const fallbackCollage = [
  { src: `${DEPT_IMG}/about-1.jpg`, alt: "Computer Engineering department - picture 1" },
  { src: `${DEPT_IMG}/about-2.jpg`, alt: "Computer Engineering department - picture 2" },
  { src: `${DEPT_IMG}/about-3.jpg`, alt: "Computer Engineering department - picture 3" },
];

// The three small tiles in the About card.
const fallbackAboutTiles = [
  { icon: FiMonitor, value: "10", label: "Laboratories" },
  { icon: FiClock, value: "1998", label: "Established" },
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
      "The Department of Computer Engineering, established in the year 1998, has consistently played a vital role in shaping skilled professionals for the IT industry.",
      "The department focuses on providing quality education and skill development in the vast and rapidly evolving field of computer engineering, which encompasses the study and application of software, hardware, networking, robotics & artificial intelligence, etc.",
    ],
  },
  {
    id: "overview",
    title: "Department overview",
    icon: FiLayers,
    view: "text",
    paragraphs: [
      "Computer engineering involves the design, development, and testing of computer systems, including both hardware and software. Computer engineers work on a wide range of tasks, from designing microchips and circuit boards to developing software for mobile devices and computer systems. They also work on networks, robotics, and artificial intelligence.",
    ],
  },
  {
    id: "jobs",
    title: "Job prospects",
    icon: FiBriefcase,
    view: "chips",
    paragraphs: [
      "Computer Engineering graduates have a wide range of employment opportunities across public and private sectors. Typical job roles include:",
    ],
    items: [
      "Computer Programmer", "Software Developer", "Data Analyst", "Web Developer", "Data Engineer",
      "Data Scientist", "Application Developer", "System Analyst", "Network Engineer",
    ],
  },
  {
    id: "labs",
    title: "Department laboratories",
    icon: FiMonitor,
    view: "chips",
    wide: true,
    paragraphs: [
      "The department boasts well-equipped laboratories and workshops aimed at strengthening theoretical knowledge with hands-on practical training. Key labs include:",
    ],
    items: [
      "Operating System Lab", "FIT lab", "MultiMedia Application Lab", "Hardware Lab", "Project Lab",
      "Python Lab", "Cloud Computing Lab", "PIC Lab", "CN Lab", "PHP Lab",
    ],
    closing: [
      "These labs are furnished with modern equipment to meet industry standards and curriculum requirements providing hands-on training to students in the modern computer era to equip them with requisite knowledge.",
    ],
  },
  {
    id: "placements",
    title: "Placement status",
    icon: FiAward,
    view: "list",
    paragraphs: [
      "The department has demonstrated commendable placement outcomes in the year 2025. Key placement students are as under:",
    ],
    items: [
      "Ms. Ashmita placed in PISOFT Informatics Pvt. Ltd.",
      "Mr. Deva placed in Reliance Projects Management Pvt. Ltd.",
      "Ms. Tannu placed in VVDN Technology Pvt. Ltd.",
      "Ms. Nisha placed in VVDN Technology Pvt. Ltd.",
      "Ms. Sonia placed in VVDN Technology Pvt. Ltd.",
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
    items: ["75% of students cleared the 5th semester. Top performer: Ms. Ashmita : 98%"],
    closing: [
      "The department continues to strive for improved academic excellence through interactive teaching methodologies and hands-on laboratory exposure. Efforts are continuously made to enhance academic results through remedial classes, workshops, and individual mentoring.",
      "The department remains committed to preparing students for both professional and academic success by offering rigorous training, career guidance, and industrial exposure.",
    ],
  },
];

// One object per person (REAL data from each person's page on the live website).
// Every card shows the name, the role, the qualification, and - when you add them - the interested area and the email.
// interest is empty for everyone on the live site, so that row is hidden until you fill it in. email shows as a mailto link.
// The date of birth is NOT shown on purpose (it is personal information).
const fallbackStaff = [
  { name: "Parveen Kohar", role: "Head of Department", photo: `${IMG}/staff/parveen-kohar.jpeg`, qualification: "B.E.", interest: "", email: "parveenkohar@crpolytechnic.org" },
  { name: "Dr. Ravinder Rathee", role: "Senior Lecturer", photo: `${IMG}/staff/ravinder-rathee.jpeg`, qualification: "ME (Software Systems), PhD", interest: "", email: "rrathee111@gmail.com" },
  { name: "Ms Priyanka", role: "Lecturer", photo: `${IMG}/staff/priyanka.jpeg`, qualification: "B.E, MCA", interest: "", email: "priya_dhawan29jan@rediffmail.com" },
  { name: "Ajeta Nandal", role: "Lecturer", photo: `${IMG}/staff/ajyeta-nandal.jpeg`, qualification: "B.Tech in Information Technology, M.Tech in Software Engineering, UGC NET JRF Qualified", interest: "", email: "ajetanandal@gmail.com" },
  { name: "Ms Keerti Kumari", role: "Junior Programmer", photo: `${IMG}/staff/keerti-kumari.jpeg`, qualification: "MCA", interest: "", email: "keertimalik4567.km@gmail.com" },
  { name: "Ashok Kumar", role: "Workshop Instructor", photo: `${IMG}/staff/ashok-kumar.jpeg`, qualification: "Matric", interest: "", email: "mann_ashok@yahoo.com" },
  { name: "Shashi Kumar", role: "Workshop Instructor", photo: `${IMG}/staff/shashi-kumar.jpeg`, qualification: "10+2", interest: "", email: "shashikumarbhunkhara@gmail.com" },
  { name: "Mr Dalvir Singh", role: "Lab Instructor", photo: `${IMG}/staff/dalvir-singh.jpeg`, qualification: "BSc (IT), MCA, M.Tech in CSE", interest: "", email: "dalvir_avis@yahoo.com" },
  { name: "Poonam Kumari", role: "Lab Instructor", photo: `${IMG}/staff/poonam-kumari.jpeg`, qualification: "B.E., M.Tech in CSE", interest: "", email: "pkadyan154@gmail.com" },
];

// Four visual cards, real facts from this department's page only.
const fallbackHighlights = [
  {
    icon: FiMonitor, value: "10", label: "Laboratories", image: `${IMG}/highlight-labs.jpg`,
    text: "Operating System, Python, Cloud Computing, Hardware, Project and more - practical training for every subject.",
  },
  {
    icon: FiClock, value: "1998", label: "Established", image: `${IMG}/highlight-since.jpg`,
    text: "Shaping skilled professionals for the IT industry since 1998.",
  },
  {
    icon: FiTrendingUp, value: "75%", label: "Cleared 5th semester", image: `${IMG}/highlight-results.jpg`,
    text: "Top performer Ms. Ashmita scored 98%.",
  },
  {
    icon: FiBriefcase, value: "2025", label: "Placements", image: `${IMG}/highlight-placements.jpg`,
    text: "Students placed at PISOFT Informatics, Reliance Projects Management and VVDN Technology.",
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
    <figure className={`cse-photo ${className}`}>
      {failed || !src ? (
        <div className="cse-photo__empty" aria-hidden="true">
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
    <div className="cse-avatar">
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

export default function Computer() {
  const { ready, data: results } = usePageReady(() => Promise.allSettled([getDepartment("computer"), getDepartments()]));
  const serverData = results?.[0]?.status === "fulfilled" ? results[0].value : null;
  const departmentList = results?.[1]?.status === "fulfilled" ? results[1].value : null;
  const departmentOptions = Array.isArray(departmentList) && departmentList.length
    ? departmentList.slice().sort((a, b) => a.order - b.order).map((item) => ({ label: item.shortName, to: `/departments/${item.slug}`, slug: item.slug }))
    : fallbackSwitcher;
  const fallbackLabels = {
    eyebrow: "Department", bannerTagLeft: "Government Polytechnic", bannerTagRight: "Rohtak (Haryana)", breadcrumb: "Computer", switcherLabel: "Department", aboutTab: "About", staffTab: "Staff", searchAbout: "Search the department information", searchStaff: "Search staff by name or role", qualificationLabel: "Qualification", interestLabel: "Interested area", highlightsEyebrow: "At a glance", highlightsTitle: "Department", highlightsTitleHighlight: "highlights", photoPlaceholder: "Photo coming soon", };
  const pageLabels = Object.fromEntries(Object.entries({ ...fallbackLabels, ...(serverData?.labels || {}) }).map(([key, value]) => [key, value || fallbackLabels[key]]));
  const banner = mediaUrl(serverData?.banner && serverData.banner !== "/images/pages-banner.png" ? serverData.banner : fallbackBanner);
  const dept = serverData ? { ...fallbackDept, ...serverData, facts: (serverData.facts || []).map((item, i) => ({ ...item, icon: fallbackDept.facts[i]?.icon || fallbackDept.facts[0]?.icon })), image: mediaUrl(serverData.image ?? fallbackDept.image) } : fallbackDept;
  const collage = serverData ? (serverData.collage || []).map((item) => ({ ...item, src: mediaUrl(item.src) })) : fallbackCollage;
  const aboutTiles = serverData ? (serverData.tiles || []).map((item, i) => ({ ...item, icon: fallbackAboutTiles[i]?.icon || fallbackAboutTiles[0]?.icon })) : fallbackAboutTiles;
  const about = serverData ? (serverData.about || []).map((item, i) => ({ ...item, icon: fallbackAbout[i]?.icon || fallbackAbout[0]?.icon })) : fallbackAbout;
  const staff = (serverData?.staff || fallbackStaff).filter((person) => [person.name, person.role, person.photo, person.qualification, person.interest, person.email].some(Boolean));
  const highlights = serverData ? (serverData.highlights || []).map((item, i) => ({ ...item, image: mediaUrl(item.image), icon: fallbackHighlights[i]?.icon || fallbackHighlights[0]?.icon })) : fallbackHighlights;
  const switcher = departmentOptions;
  const currentLabel = switcher.find((item) => item.slug === "computer" || item.to === CURRENT)?.label || fallbackCurrentLabel;

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

  if (!ready) return <main id="main" className="cse-page"><PageLoader /></main>;

  return (
    <main id="main" className="cse-page">
      {/* ---- hero (same as About us / Facilities) ---- */}
      <section className="cse-hero" aria-label="Computer Engineering department" style={{ "--img": `url("${banner}")` }}>
        <div className="cse-hero__photo" />
        <div className="cse-hero__tags">
          <span className="cse-hero__tag cse-hero__tag--left">
            <span className="cse-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {pageLabels.bannerTagLeft}
          </span>
          <span className="cse-hero__tag cse-hero__tag--right">
            <span className="cse-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {pageLabels.bannerTagRight}
          </span>
        </div>
        <nav className="cse-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Departments</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabels.breadcrumb}</span>
        </nav>
      </section>

      <div className="container cse-wrap">
        {/* ---- title block + department picture ---- */}
        <header className="cse-top">
          <div className="cse-top__text">
            <span className="cse-eyebrow">{pageLabels.eyebrow}</span>
            <h1>{dept.title}{dept.titleLine2 && <span>{dept.titleLine2}</span>}</h1>
            <p>{dept.lead}</p>
            <ul className="cse-facts">
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
          <div className="cse-frame">
            <Photo src={dept.image} alt={dept.imageAlt} className="cse-frame__photo" placeholder={pageLabels.photoPlaceholder} />
          </div>
        </header>

        {/* ---- department switcher: pills on wide screens, a dropdown on small screens ---- */}
        <nav className="cse-switch" aria-label="Departments">
          <ul className="cse-switch__list">
            {switcher.map((item) => {
              const isCurrent = item.slug === "computer" || item.to === CURRENT;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`cse-switch__link${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="cse-switch__menu" ref={menuRef}>
            <button
              type="button"
              className="cse-switch__button"
              aria-expanded={menuOpen}
              aria-controls="cse-switch-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="cse-switch__label">{pageLabels.switcherLabel}</span>
              <span className="cse-switch__current">{currentLabel}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            {menuOpen && (
              <ul id="cse-switch-panel" className="cse-switch__panel">
                {switcher.map((item) => {
                  const isCurrent = item.slug === "computer" || item.to === CURRENT;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`cse-switch__link${isCurrent ? " is-current" : ""}`}
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
        <section className="cse-info" aria-label="Department information">
          <div className="cse-toolbar">
            <label className="cse-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
                aria-label={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
              />
              {query && (
                <button type="button" className="cse-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="cse-tabs" role="tablist" aria-label="Department sections" onKeyDown={onTabKey}>
              <button
                ref={(el) => { tabRefs.current.about = el; }}
                type="button" role="tab" id="cse-tab-about" aria-selected={tab === "about"} aria-controls="cse-panel"
                tabIndex={tab === "about" ? 0 : -1} className={`cse-tab${tab === "about" ? " is-active" : ""}`} onClick={() => pickTab("about")}
              >
                <FiFileText aria-hidden="true" /> {pageLabels.aboutTab || "About"}
              </button>
              <button
                ref={(el) => { tabRefs.current.staff = el; }}
                type="button" role="tab" id="cse-tab-staff" aria-selected={tab === "staff"} aria-controls="cse-panel"
                tabIndex={tab === "staff" ? 0 : -1} className={`cse-tab${tab === "staff" ? " is-active" : ""}`} onClick={() => pickTab("staff")}
              >
                <FiUsers aria-hidden="true" /> {pageLabels.staffTab || "Staff"} <span className="cse-tab__n">{staff.length}</span>
              </button>
            </div>
          </div>

          <div id="cse-panel" className="cse-panel" role="tabpanel" aria-labelledby={`cse-tab-${tab}`} tabIndex={0}>
            {tab === "about" ? (
              <>
                {!q && feature && (
                  <article className="cse-feature">
                    <div className="cse-collage">
                      <Photo src={collage[0].src} alt={collage[0].alt} className="cse-collage__a" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[1].src} alt={collage[1].alt} className="cse-collage__b" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[2].src} alt={collage[2].alt} className="cse-collage__c" placeholder={pageLabels.photoPlaceholder} />
                    </div>
                    <div className="cse-feature__text">
                      <span className="cse-feature__bar" aria-hidden="true" />
                      <h2>{feature.title}</h2>
                      {feature.paragraphs.map((text) => <p key={text}>{text}</p>)}
                      <ul className="cse-tiles">
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
                  <div className="cse-about">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <article key={section.id} className={`cse-block${section.wide ? " cse-block--wide" : ""}`}>
                          <h2><span className="cse-block__icon"><Icon aria-hidden="true" /></span><Mark text={section.title} query={q} /></h2>
                          {section.paragraphs?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                          {section.items?.length > 0 && (
                            <ul className={`cse-items cse-items--${section.view}`}>
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
                  <p className="cse-none">Nothing found for "{query}". Try another word.</p>
                )}
              </>
            ) : people.length > 0 ? (
              <ul className="cse-staff">
                {people.map((person) => (
                  <li key={person.name} className="cse-card">
                    <Avatar person={person} placeholder={pageLabels.photoPlaceholder} />
                    <div className="cse-card__body">
                      <h3><Mark text={person.name} query={q} /></h3>
                      {person.role && <span className="cse-card__role"><Mark text={person.role} query={q} /></span>}
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
                      <a className="cse-card__mail" href={`mailto:${person.email}`}>
                        <FiMail aria-hidden="true" />
                        <span>{person.email}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cse-none">No staff found for "{query}". Try another name or role.</p>
            )}
          </div>
        </section>

        {/* ---- department highlights ---- */}
        <section className="cse-highlights" aria-labelledby="cse-hl-title">
          <header className="cse-head">
            <span className="cse-eyebrow cse-eyebrow--line">{pageLabels.highlightsEyebrow || "At a glance"}</span>
            <h2 id="cse-hl-title">{pageLabels.highlightsTitle || "Department"} <span>{pageLabels.highlightsTitleHighlight || "highlights"}</span></h2>
          </header>
          <ul className="cse-hl">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="cse-hl__card" style={{ "--hl-img": `url("${mediaUrl(item.image)}")` }}>
                  <div className="cse-hl__top">
                    <span className="cse-hl__icon"><Icon aria-hidden="true" /></span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="cse-hl__label">{item.label}</span>
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