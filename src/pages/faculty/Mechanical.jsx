// Mechanical.jsx - Departments > Mechanical Engineering (route: /departments/mechanical).
// Page order: hero (same as About / Facilities) -> title block + department picture -> department switcher
//             -> search + About / Staff tabs -> department highlights.
// Own styles (Mechanical.css, every class starts with "mec-"). Nothing here is shared with another department.
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - everything is a list at the top of this file:
//   dept         title, short introduction, quick facts and the framed department picture
//   collage      the three About pictures: [small left, small right, large below]
//   about        the About sections (first one = the card with the collage, the rest = cards below it)
//   staff        one object per person: name, role, photo, and OPTIONAL qualification / interest / email
//                (empty fields are simply not shown - add them whenever they are available)
//   highlights   the four visual cards at the bottom
// Department and collage photos use /images/faculty/mechanical-engineering/; staff photos remain under /images/departments/mechanical/staff/.
// A missing picture shows a clean placeholder, a missing staff photo shows the person's initials.
//
//   /media/teachers/<file>   -> public/images/departments/mechanical/staff/<file>   (photo file names used in the staff list below)
//   hero.jpg, about-1.jpg, about-2.jpg, about-3.jpg -> /images/faculty/mechanical-engineering/ (department picture and About collage)
//   mechanical-highlight-*.jpg (4 files named in the highlights list) -> backgrounds of the highlight cards
// The banner /images/pages-banner.png is the same one the About / Facilities pages use.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartment, getDepartments, mediaUrl } from "../../services/departmentService";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiChevronRight, FiMapPin, FiSearch, FiX, FiImage, FiInfo, FiBriefcase, FiMonitor, FiAward, FiTrendingUp,
  FiCheckCircle, FiFileText, FiUsers, FiUser, FiBookOpen, FiMail, FiChevronDown,
} from "react-icons/fi";
import "./Mechanical.css";

const IMG = "/images/departments/mechanical";
const DEPT_IMG = "/images/faculty/mechanical-engineering";

// Same banner as the About / Facilities pages (a patterned navy banner shows if it is missing).
const fallbackBanner = "/images/pages-banner.png";

const fallbackDept = {
  title: "Mechanical Engineering",
  titleLine2: "",
  lead: "One of the oldest and broadest branches of engineering - machines, manufacturing and industry-ready skills.",
  facts: [
    { icon: FiBookOpen, text: "3-year diploma" },
    { icon: FiUsers, text: "60 seats" },
    { icon: FiMonitor, text: "8 laboratories" },
  ],
  image: `${DEPT_IMG}/hero.jpg`,
  imageAlt: "Mechanical Engineering department",
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
const CURRENT = "/departments/mechanical";
const fallbackCurrentLabel = fallbackSwitcher.find((item) => item.to === CURRENT)?.label;

// Two small pictures on top, one wide picture below (the layout of the About card).
const fallbackCollage = [
  { src: `${DEPT_IMG}/about-1.jpg`, alt: "Mechanical Engineering department - picture 1" },
  { src: `${DEPT_IMG}/about-2.jpg`, alt: "Mechanical Engineering department - picture 2" },
  { src: `${DEPT_IMG}/about-3.jpg`, alt: "Mechanical Engineering department - picture 3" },
];

// The three small tiles in the About card.
const fallbackAboutTiles = [
  { icon: FiMonitor, value: "8", label: "Laboratories" },
  { icon: FiAward, value: "48+", label: "Placed, batch 2022-25" },
  { icon: FiTrendingUp, value: "84.59%", label: "Top academic score" },
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
      "Mechanical Engineering is one of the oldest branches of engineering and is often called the \"mother\" branch. The department has a presence across the country in both private and public sector undertakings.",
      "The department has qualified, experienced faculty and a panel of academicians and professionals who give expert lectures and share real-world experience with the students.",
    ],
  },
  {
    id: "jobs",
    title: "Job prospects",
    icon: FiBriefcase,
    view: "chips",
    paragraphs: [
      "Diploma graduates of the department work in:",
    ],
    items: [
      "Automobiles", "Fasteners", "Tool designing", "Machine tools production", "Railways", "Metro", "Power plants",
      "Various manufacturing and service industries",
    ],
  },
  {
    id: "labs",
    title: "Department laboratories",
    icon: FiMonitor,
    view: "chips",
    paragraphs: [
      "The department has the following laboratories:",
    ],
    items: [
      "Strength Of Materials Lab", "Heat Engine Lab", "Automobile Engineering Lab", "Mechanical Measurement Lab", "CAD Lab",
      "CNC Lab", "Material & Metallurgy Lab", "Refrigeration and Air Conditioning Lab",
    ],
  },
  {
    id: "placements",
    title: "Placement status",
    icon: FiAward,
    view: "list",
    wide: true,
    paragraphs: [
      "Final-year students of the 2022-25 batch were placed in reputed companies:",
    ],
    items: [
      "22 students - Machino Plastics Ltd.",
      "10 students - Escorts Kubota Ltd.",
      "10 students - Motherson Sumi Ltd.",
      "6 students - Mahindra Dealership",
      "and others",
    ],
    closing: [
      "Major recruiters: Hero MotoCorp, JBM Group, Escorts Kubota Ltd., Subros Ltd., Micron Precision Screws Ltd. and Machino Plastics Ltd.",
    ],
  },
  {
    id: "academic",
    title: "Academic performance",
    icon: FiTrendingUp,
    view: "list",
    wide: true,
    paragraphs: [
      "The department reports consistent improvement in results across all semesters. Top performers:",
    ],
    items: [
      "Tushar (2020) - 84.59%",
      "Amit Tiwari (2021) - 84.12%",
      "Ayush Dwivedi (2022) - 82.75%",
    ],
    closing: [
      "Remedial classes are held regularly for weaker students. Faculty use flipped classroom and smart classroom methods along with CAD software, and the department holds internal assessments, quiz competitions and model tests.",
    ],
  },
  {
    id: "activities",
    title: "Activities and industry exposure",
    icon: FiUsers,
    view: "list",
    wide: true,
    items: [
      "Expert lectures on topics including Automation and Artificial Intelligence (AI)",
      "Industrial visits for practical exposure, including CNC trainer lathe and CNC milling machine training",
      "CAD lectures for 2nd-year and final-year students, delivered with a private agency",
      "Final-year students presented major projects at inter-college tech fests in Sonipat",
    ],
  },
];

// One object per person (REAL data from each person's page on the live website).
// interest is empty for everyone on the live site, so that row is hidden until you fill it in. email shows as a mailto link.
// The date of birth is NOT shown on purpose (it is personal information).
const fallbackStaff = [
  { name: "Mr. Sonu", role: "Senior Lecturer", photo: `${IMG}/staff/sonu.jpeg`, qualification: "B.tech", interest: "", email: "sonunandal52@gmail.com" },
  { name: "Mr Vivek Deswal", role: "Lab Instructor", photo: `${IMG}/staff/vivek-deswal.jpeg`, qualification: "Diploma in Mech. Engg, B.Tech, M.Tech in Manufacturing Technology", interest: "", email: "vivekdeswal@crpolytechnic.org" },
  { name: "Mr Sudeep Kumar", role: "Lab Instructor", photo: `${IMG}/staff/sudeep-kumar.jpeg`, qualification: "Diploma in Production", interest: "", email: "sudeepkumar@crpolytechnic.org" },
];

// Four visual cards, real facts from this department's page only.
const fallbackHighlights = [
  {
    icon: FiMonitor, value: "8", label: "Laboratories", image: `${IMG}/mechanical-highlight-labs.jpg`,
    text: "Strength of Materials, Heat Engine, CAD, CNC, Refrigeration and Air Conditioning and more.",
  },
  {
    icon: FiAward, value: "48+", label: "Students placed", image: `${IMG}/mechanical-highlight-placements.jpg`,
    text: "Batch 2022-25: Machino Plastics, Escorts Kubota, Motherson Sumi, Mahindra Dealership and others.",
  },
  {
    icon: FiTrendingUp, value: "84.59%", label: "Top academic score", image: `${IMG}/mechanical-highlight-results.jpg`,
    text: "Tushar (2020). Amit Tiwari scored 84.12% in 2021 and Ayush Dwivedi 82.75% in 2022.",
  },
  {
    icon: FiBriefcase, value: "6", label: "Major recruiters", image: `${IMG}/mechanical-highlight-recruiters.jpg`,
    text: "Hero MotoCorp, JBM Group, Escorts Kubota, Subros, Micron Precision Screws and Machino Plastics.",
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
    <figure className={`mec-photo ${className}`}>
      {failed || !src ? (
        <div className="mec-photo__empty" aria-hidden="true">
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
    <div className="mec-avatar">
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

export default function Mechanical() {
  const [serverData, setServerData] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(fallbackSwitcher);
  useEffect(() => {
    let active = true;
    getDepartment("mechanical").then((data) => { if (active) setServerData(data); }).catch(() => {});
    getDepartments().then((list) => {
      if (active && Array.isArray(list) && list.length) setDepartmentOptions(list.slice().sort((a, b) => a.order - b.order).map((item) => ({ label: item.shortName, to: `/departments/${item.slug}`, slug: item.slug })));
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const fallbackLabels = {
    eyebrow: "Department", bannerTagLeft: "Government Polytechnic", bannerTagRight: "Rohtak (Haryana)", breadcrumb: "Mechanical", switcherLabel: "Department", aboutTab: "About", staffTab: "Staff", searchAbout: "Search the department information", searchStaff: "Search staff by name or role", qualificationLabel: "Qualification", interestLabel: "Interested area", highlightsEyebrow: "At a glance", highlightsTitle: "Department", highlightsTitleHighlight: "highlights", photoPlaceholder: "Photo coming soon", };
  const pageLabels = Object.fromEntries(Object.entries({ ...fallbackLabels, ...(serverData?.labels || {}) }).map(([key, value]) => [key, value || fallbackLabels[key]]));
  const banner = mediaUrl(serverData?.banner || fallbackBanner);
  const dept = serverData ? { ...fallbackDept, ...serverData, facts: (serverData.facts || []).map((item, i) => ({ ...item, icon: fallbackDept.facts[i]?.icon || fallbackDept.facts[0]?.icon })), image: mediaUrl(serverData.image ?? fallbackDept.image) } : fallbackDept;
  const collage = serverData ? (serverData.collage || []).map((item) => ({ ...item, src: mediaUrl(item.src) })) : fallbackCollage;
  const aboutTiles = serverData ? (serverData.tiles || []).map((item, i) => ({ ...item, icon: fallbackAboutTiles[i]?.icon || fallbackAboutTiles[0]?.icon })) : fallbackAboutTiles;
  const about = serverData ? (serverData.about || []).map((item, i) => ({ ...item, icon: fallbackAbout[i]?.icon || fallbackAbout[0]?.icon })) : fallbackAbout;
  const staff = (serverData?.staff || fallbackStaff).filter((person) => [person.name, person.role, person.photo, person.qualification, person.interest, person.email].some(Boolean));
  const highlights = serverData ? (serverData.highlights || []).map((item, i) => ({ ...item, image: mediaUrl(item.image), icon: fallbackHighlights[i]?.icon || fallbackHighlights[0]?.icon })) : fallbackHighlights;
  const switcher = departmentOptions;
  const currentLabel = switcher.find((item) => item.slug === "mechanical" || item.to === CURRENT)?.label || fallbackCurrentLabel;

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
    <main id="main" className="mec-page">
      {/* ---- hero (same as About us / Facilities) ---- */}
      <section className="mec-hero" aria-label="Mechanical Engineering department" style={{ "--img": `url("${banner}")` }}>
        <div className="mec-hero__photo" />
        <div className="mec-hero__tags">
          <span className="mec-hero__tag mec-hero__tag--left">
            <span className="mec-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {pageLabels.bannerTagLeft}
          </span>
          <span className="mec-hero__tag mec-hero__tag--right">
            <span className="mec-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {pageLabels.bannerTagRight}
          </span>
        </div>
        <nav className="mec-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Departments</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabels.breadcrumb}</span>
        </nav>
      </section>

      <div className="container mec-wrap">
        {/* ---- title block + department picture ---- */}
        <header className="mec-top">
          <div className="mec-top__text">
            <span className="mec-eyebrow">{pageLabels.eyebrow}</span>
            <h1>{dept.title}{dept.titleLine2 && <span>{dept.titleLine2}</span>}</h1>
            <p>{dept.lead}</p>
            <ul className="mec-facts">
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
          <div className="mec-frame">
            <Photo src={dept.image} alt={dept.imageAlt} className="mec-frame__photo" placeholder={pageLabels.photoPlaceholder} />
          </div>
        </header>

        {/* ---- department switcher: pills on wide screens, a dropdown on small screens ---- */}
        <nav className="mec-switch" aria-label="Departments">
          <ul className="mec-switch__list">
            {switcher.map((item) => {
              const isCurrent = item.slug === "mechanical" || item.to === CURRENT;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`mec-switch__link${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mec-switch__menu" ref={menuRef}>
            <button
              type="button"
              className="mec-switch__button"
              aria-expanded={menuOpen}
              aria-controls="mec-switch-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="mec-switch__label">{pageLabels.switcherLabel}</span>
              <span className="mec-switch__current">{currentLabel}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            {menuOpen && (
              <ul id="mec-switch-panel" className="mec-switch__panel">
                {switcher.map((item) => {
                  const isCurrent = item.slug === "mechanical" || item.to === CURRENT;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`mec-switch__link${isCurrent ? " is-current" : ""}`}
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
        <section className="mec-info" aria-label="Department information">
          <div className="mec-toolbar">
            <label className="mec-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
                aria-label={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
              />
              {query && (
                <button type="button" className="mec-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="mec-tabs" role="tablist" aria-label="Department sections" onKeyDown={onTabKey}>
              <button
                ref={(el) => { tabRefs.current.about = el; }}
                type="button" role="tab" id="mec-tab-about" aria-selected={tab === "about"} aria-controls="mec-panel"
                tabIndex={tab === "about" ? 0 : -1} className={`mec-tab${tab === "about" ? " is-active" : ""}`} onClick={() => pickTab("about")}
              >
                <FiFileText aria-hidden="true" /> {pageLabels.aboutTab || "About"}
              </button>
              <button
                ref={(el) => { tabRefs.current.staff = el; }}
                type="button" role="tab" id="mec-tab-staff" aria-selected={tab === "staff"} aria-controls="mec-panel"
                tabIndex={tab === "staff" ? 0 : -1} className={`mec-tab${tab === "staff" ? " is-active" : ""}`} onClick={() => pickTab("staff")}
              >
                <FiUsers aria-hidden="true" /> {pageLabels.staffTab || "Staff"} <span className="mec-tab__n">{staff.length}</span>
              </button>
            </div>
          </div>

          <div id="mec-panel" className="mec-panel" role="tabpanel" aria-labelledby={`mec-tab-${tab}`} tabIndex={0}>
            {tab === "about" ? (
              <>
                {!q && feature && (
                  <article className="mec-feature">
                    <div className="mec-collage">
                      <Photo src={collage[0].src} alt={collage[0].alt} className="mec-collage__a" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[1].src} alt={collage[1].alt} className="mec-collage__b" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[2].src} alt={collage[2].alt} className="mec-collage__c" placeholder={pageLabels.photoPlaceholder} />
                    </div>
                    <div className="mec-feature__text">
                      <span className="mec-feature__bar" aria-hidden="true" />
                      <h2>{feature.title}</h2>
                      {feature.paragraphs.map((text) => <p key={text}>{text}</p>)}
                      <ul className="mec-tiles">
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
                  <div className="mec-about">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <article key={section.id} className={`mec-block${section.wide ? " mec-block--wide" : ""}`}>
                          <h2><span className="mec-block__icon"><Icon aria-hidden="true" /></span><Mark text={section.title} query={q} /></h2>
                          {section.paragraphs?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                          {section.items?.length > 0 && (
                            <ul className={`mec-items mec-items--${section.view}`}>
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
                  <p className="mec-none">Nothing found for "{query}". Try another word.</p>
                )}
              </>
            ) : people.length > 0 ? (
              <ul className="mec-staff">
                {people.map((person) => (
                  <li key={person.name} className="mec-card">
                    <Avatar person={person} placeholder={pageLabels.photoPlaceholder} />
                    <div className="mec-card__body">
                      <h3><Mark text={person.name} query={q} /></h3>
                      {person.role && <span className="mec-card__role"><Mark text={person.role} query={q} /></span>}
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
                      <a className="mec-card__mail" href={`mailto:${person.email}`}>
                        <FiMail aria-hidden="true" />
                        <span>{person.email}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mec-none">No staff found for "{query}". Try another name or role.</p>
            )}
          </div>
        </section>

        {/* ---- department highlights ---- */}
        <section className="mec-highlights" aria-labelledby="mec-hl-title">
          <header className="mec-head">
            <span className="mec-eyebrow mec-eyebrow--line">{pageLabels.highlightsEyebrow || "At a glance"}</span>
            <h2 id="mec-hl-title">{pageLabels.highlightsTitle || "Department"} <span>{pageLabels.highlightsTitleHighlight || "highlights"}</span></h2>
          </header>
          <ul className="mec-hl">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="mec-hl__card" style={{ "--hl-img": `url("${mediaUrl(item.image)}")` }}>
                  <div className="mec-hl__top">
                    <span className="mec-hl__icon"><Icon aria-hidden="true" /></span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="mec-hl__label">{item.label}</span>
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