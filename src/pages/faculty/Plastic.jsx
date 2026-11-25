// Plastic.jsx - Departments > Plastic Technology (route: /departments/plastic).
// Page order: hero (same as About / Facilities) -> title block + department picture -> department switcher
//             -> search + About / Staff tabs -> department highlights.
// Own styles (Plastic.css, every class starts with "pla-"). Nothing here is shared with another department.
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - everything is a list at the top of this file:
//   dept         title, short introduction, quick facts and the framed department picture
//   collage      the three About pictures: [small left, small right, large below]
//   about        the About sections (first one = the card with the collage, the rest = cards below it)
//   staff        one object per person: name, role, photo, and OPTIONAL qualification / interest / email
//                (empty fields are simply not shown - add them whenever they are available)
//   highlights   the four visual cards at the bottom
// Department and collage photos use /images/faculty/plastic-engineering/; staff photos remain under /images/departments/plastic/staff/.
// A missing picture shows a clean placeholder, a missing staff photo shows the person's initials.
//
//   /media/teachers/<file>   -> public/images/departments/plastic/staff/<file>   (photo file names used in the staff list below)
//   hero.jpg, about-1.jpg, about-2.jpg, about-3.jpg -> /images/faculty/plastic-engineering/ (department picture and About collage)
//   plastic-highlight-*.jpg (4 files named in the highlights list) -> backgrounds of the highlight cards
// The banner /images/pages-banner.png is the same one the About / Facilities pages use.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartment, getDepartments, mediaUrl } from "../../services/departmentService";
import PageLoader, { usePageReady } from "../../components/PageLoader";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiChevronRight, FiMapPin, FiSearch, FiX, FiImage, FiInfo, FiLayers, FiBriefcase, FiMonitor, FiAward, FiTrendingUp,
  FiCheckCircle, FiFileText, FiUsers, FiClock, FiUser, FiCalendar, FiBookOpen, FiMail, FiChevronDown,
} from "react-icons/fi";
import "./Plastic.css";

const IMG = "/images/departments/plastic";
const DEPT_IMG = "/images/faculty/plastic-engineering";

// Same banner as the About / Facilities pages (a patterned navy banner shows if it is missing).
const fallbackBanner = "/images/pages-banner.png";

const fallbackDept = {
  title: "Plastic Technology",
  titleLine2: "",
  lead: "Processing, design and fabrication of moulds and plastics products - skilled manpower for plastics and allied industries.",
  facts: [
    { icon: FiCalendar, text: "Since 1997-98" },
    { icon: FiBookOpen, text: "3-year diploma" },
    { icon: FiUsers, text: "54 seats" },
  ],
  image: `${DEPT_IMG}/hero.jpg`,
  imageAlt: "Plastic Technology department",
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
const CURRENT = "/departments/plastic";
const fallbackCurrentLabel = fallbackSwitcher.find((item) => item.to === CURRENT)?.label;

// Two small pictures on top, one wide picture below (the layout of the About card).
const fallbackCollage = [
  { src: `${DEPT_IMG}/about-1.jpg`, alt: "Plastic Technology department - picture 1" },
  { src: `${DEPT_IMG}/about-2.jpg`, alt: "Plastic Technology department - picture 2" },
  { src: `${DEPT_IMG}/about-3.jpg`, alt: "Plastic Technology department - picture 3" },
];

// The three small tiles in the About card.
const fallbackAboutTiles = [
  { icon: FiClock, value: "1997", label: "Started" },
  { icon: FiAward, value: "100%", label: "Placement record" },
  { icon: FiTrendingUp, value: "7", label: "State board toppers" },
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
      "The Plastics Technology Department is the youngest programme of the institute. It began in the 1997-98 session, with the first batch starting in May/June 1997. It offers a three-year diploma after matric and a two-year diploma under the lateral entry scheme after 10+2 (Non Medical) or ITI.",
      "The department covers the processing, design, development and fabrication of moulds and plastics products.",
    ],
  },
  {
    id: "vision",
    title: "Vision and mission",
    icon: FiLayers,
    view: "text",
    wide: true,
    paragraphs: [
      "Vision: to produce skilled manpower that can work globally in plastics and allied industries.",
      "Mission: curriculum development through industry-institute interaction, industrial training and visits, project work, communication and managerial skills, entrepreneurship and self-discipline.",
    ],
  },
  {
    id: "uses",
    title: "Where plastics are used",
    icon: FiTrendingUp,
    view: "chips",
    paragraphs: ["Plastics are used in many sectors, including:"],
    items: ["Commodity", "Packaging", "Medical", "Automotive", "Electricals", "Electronics", "Marine", "Aerospace", "Agricultural"],
  },
  {
    id: "jobs",
    title: "Job prospects",
    icon: FiBriefcase,
    view: "text",
    paragraphs: [
      "The Plastics Technologist handles raw material selection and testing, product design, mould design and fabrication, manufacturing, and quality testing using Statistical Quality Control methods.",
    ],
  },
  {
    id: "placements",
    title: "Placement status",
    icon: FiAward,
    view: "chips",
    wide: true,
    paragraphs: [
      "The department reports a 100% placement record since the first batch passed out in 2000. More than 50% of India's plastics industries are in Northern India. Recruiters include:",
    ],
    items: [
      "Maruti and its Vendor Companies", "Aisin Automotive, Rohtak", "Hi-Tech Plastics, Rohtak", "Asian Paints, Rohtak", "Subros Ltd., Greater Noida",
    ],
  },
  {
    id: "alumni",
    title: "Notable alumni",
    icon: FiUsers,
    view: "list",
    wide: true,
    items: [
      "Ravi Soni (1997-2000) - Deputy General Manager, WittmanBattenfeld India (P) Ltd.",
      "Neeraj Garg (1998-2001) - Managing Director, Rymbal",
      "Deepak Chopra (1997-2000) - Co-Founder and Director, JBLD International (P) Ltd.",
      "Shafali Wankhede (2007-2010) - Teaching Professional",
      "InderJeet (1998-2001) - VBROS AUTO (P) Ltd.",
      "Himanshu (2022-2025) - Machino Plastics (P) Ltd.",
    ],
  },
  {
    id: "academic",
    title: "Academic performance",
    icon: FiTrendingUp,
    view: "list",
    wide: true,
    paragraphs: [
      "Students of the department have consistently ranked among the state's top three almost every year. State board toppers:",
    ],
    items: [
      "Deepak Chopra (1997-2000)",
      "Deepak Kapoor (1998-2001)",
      "Naveen Shoker (2006-2009)",
      "Shafali Wankhede (2007-2010)",
      "Vikas (2014-2017)",
      "Shaquib (2018-2021)",
      "Himanshu (2022-2025)",
    ],
  },
  {
    id: "projects",
    title: "Student projects",
    icon: FiMonitor,
    view: "list",
    items: [
      "Fuel from waste plastic materials - first place, Intra Polytechnic Competition",
      "Flower pot made from plastics composite material - Inter Polytechnic Competition",
      "Flower pot stand made from waste plastics - third place, Intra Polytechnic Competition",
    ],
  },
  {
    id: "industry",
    title: "Industrial interactions",
    icon: FiBriefcase,
    view: "chips",
    items: [
      "Uno Minda Limited, Manesar", "Hi-Tech Plastics, Rohtak", "Shree Shyama Jee Polyplast, Rohtak", "Indane Cables, Rohtak",
      "Delton Cables Ltd., Faridabad", "CIPET, Murthal", "MSME, Rohtak",
    ],
  },
  {
    id: "extra",
    title: "Extracurricular activities",
    icon: FiUsers,
    view: "list",
    wide: true,
    items: [
      "Plastics Awareness Program",
      "Alumni Meet",
      "Yearly programs on applications of plastics, their environmental impact and waste reduction, with government and private organizations",
    ],
  },
];

// One object per person (REAL data from each person's page on the live website).
// interest is empty for everyone on the live site, so that row is hidden until you fill it in. email shows as a mailto link.
// The date of birth is NOT shown on purpose (it is personal information).
const fallbackStaff = [
  { name: "Dr. Keshak Babu", role: "Lecturer", photo: `${IMG}/staff/keshak-babu.jpeg`, qualification: "M.Tech(Polymer Tech.)", interest: "", email: "keshak_babu@rediffmail.com" },
  { name: "Mr Pardeep Duhan", role: "Workshop Instructor", photo: `${IMG}/staff/pardeep-duhan.jpeg`, qualification: "DPMMT (CIPET), B.Tech Mech.", interest: "", email: "pardeepduhan@gmail.com" },
  { name: "Mr Aditya Bhatnagar", role: "Lab Instructor", photo: `${IMG}/staff/aditya-bhatnagar.jpeg`, qualification: "Diploma in Plastic Technology", interest: "", email: "adityabhatnagar65@yahoo.co.in" },
];

// Four visual cards, real facts from this department's page only.
const fallbackHighlights = [
  {
    icon: FiClock, value: "1997", label: "Started", image: `${IMG}/plastic-highlight-since.jpg`,
    text: "The youngest programme of the institute, running since the 1997-98 session.",
  },
  {
    icon: FiAward, value: "100%", label: "Placement record", image: `${IMG}/plastic-highlight-placements.jpg`,
    text: "Since the first batch passed out in 2000. Recruiters include Maruti, Aisin, Asian Paints and Subros.",
  },
  {
    icon: FiTrendingUp, value: "7", label: "State board toppers", image: `${IMG}/plastic-highlight-results.jpg`,
    text: "From Deepak Chopra (1997-2000) to Himanshu (2022-2025).",
  },
  {
    icon: FiBriefcase, value: "7", label: "Industrial interactions", image: `${IMG}/plastic-highlight-industry.jpg`,
    text: "Uno Minda, Hi-Tech Plastics, Delton Cables, CIPET, MSME and more.",
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
    <figure className={`pla-photo ${className}`}>
      {failed || !src ? (
        <div className="pla-photo__empty" aria-hidden="true">
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
    <div className="pla-avatar">
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

export default function Plastic() {
  const { ready, data: results } = usePageReady(() => Promise.allSettled([getDepartment("plastic"), getDepartments()]));
  const serverData = results?.[0]?.status === "fulfilled" ? results[0].value : null;
  const departmentList = results?.[1]?.status === "fulfilled" ? results[1].value : null;
  const departmentOptions = Array.isArray(departmentList) && departmentList.length
    ? departmentList.slice().sort((a, b) => a.order - b.order).map((item) => ({ label: item.shortName, to: `/departments/${item.slug}`, slug: item.slug }))
    : fallbackSwitcher;
  const fallbackLabels = {
    eyebrow: "Department", bannerTagLeft: "Government Polytechnic", bannerTagRight: "Rohtak (Haryana)", breadcrumb: "Plastic", switcherLabel: "Department", aboutTab: "About", staffTab: "Staff", searchAbout: "Search the department information", searchStaff: "Search staff by name or role", qualificationLabel: "Qualification", interestLabel: "Interested area", highlightsEyebrow: "At a glance", highlightsTitle: "Department", highlightsTitleHighlight: "highlights", photoPlaceholder: "Photo coming soon", };
  const pageLabels = Object.fromEntries(Object.entries({ ...fallbackLabels, ...(serverData?.labels || {}) }).map(([key, value]) => [key, value || fallbackLabels[key]]));
  const banner = mediaUrl(serverData?.banner || fallbackBanner);
  const dept = serverData ? { ...fallbackDept, ...serverData, facts: (serverData.facts || []).map((item, i) => ({ ...item, icon: fallbackDept.facts[i]?.icon || fallbackDept.facts[0]?.icon })), image: mediaUrl(serverData.image ?? fallbackDept.image) } : fallbackDept;
  const collage = serverData ? (serverData.collage || []).map((item) => ({ ...item, src: mediaUrl(item.src) })) : fallbackCollage;
  const aboutTiles = serverData ? (serverData.tiles || []).map((item, i) => ({ ...item, icon: fallbackAboutTiles[i]?.icon || fallbackAboutTiles[0]?.icon })) : fallbackAboutTiles;
  const about = serverData ? (serverData.about || []).map((item, i) => ({ ...item, icon: fallbackAbout[i]?.icon || fallbackAbout[0]?.icon })) : fallbackAbout;
  const staff = (serverData?.staff || fallbackStaff).filter((person) => [person.name, person.role, person.photo, person.qualification, person.interest, person.email].some(Boolean));
  const highlights = serverData ? (serverData.highlights || []).map((item, i) => ({ ...item, image: mediaUrl(item.image), icon: fallbackHighlights[i]?.icon || fallbackHighlights[0]?.icon })) : fallbackHighlights;
  const switcher = departmentOptions;
  const currentLabel = switcher.find((item) => item.slug === "plastic" || item.to === CURRENT)?.label || fallbackCurrentLabel;

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

  if (!ready) return <main id="main" className="pla-page"><PageLoader /></main>;

  return (
    <main id="main" className="pla-page">
      {/* ---- hero (same as About us / Facilities) ---- */}
      <section className="pla-hero" aria-label="Plastic Technology department" style={{ "--img": `url("${banner}")` }}>
        <div className="pla-hero__photo" />
        <div className="pla-hero__tags">
          <span className="pla-hero__tag pla-hero__tag--left">
            <span className="pla-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {pageLabels.bannerTagLeft}
          </span>
          <span className="pla-hero__tag pla-hero__tag--right">
            <span className="pla-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {pageLabels.bannerTagRight}
          </span>
        </div>
        <nav className="pla-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Departments</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabels.breadcrumb}</span>
        </nav>
      </section>

      <div className="container pla-wrap">
        {/* ---- title block + department picture ---- */}
        <header className="pla-top">
          <div className="pla-top__text">
            <span className="pla-eyebrow">{pageLabels.eyebrow}</span>
            <h1>{dept.title}{dept.titleLine2 && <span>{dept.titleLine2}</span>}</h1>
            <p>{dept.lead}</p>
            <ul className="pla-facts">
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
          <div className="pla-frame">
            <Photo src={dept.image} alt={dept.imageAlt} className="pla-frame__photo" placeholder={pageLabels.photoPlaceholder} />
          </div>
        </header>

        {/* ---- department switcher: pills on wide screens, a dropdown on small screens ---- */}
        <nav className="pla-switch" aria-label="Departments">
          <ul className="pla-switch__list">
            {switcher.map((item) => {
              const isCurrent = item.slug === "plastic" || item.to === CURRENT;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`pla-switch__link${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pla-switch__menu" ref={menuRef}>
            <button
              type="button"
              className="pla-switch__button"
              aria-expanded={menuOpen}
              aria-controls="pla-switch-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="pla-switch__label">{pageLabels.switcherLabel}</span>
              <span className="pla-switch__current">{currentLabel}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            {menuOpen && (
              <ul id="pla-switch-panel" className="pla-switch__panel">
                {switcher.map((item) => {
                  const isCurrent = item.slug === "plastic" || item.to === CURRENT;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`pla-switch__link${isCurrent ? " is-current" : ""}`}
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
        <section className="pla-info" aria-label="Department information">
          <div className="pla-toolbar">
            <label className="pla-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
                aria-label={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
              />
              {query && (
                <button type="button" className="pla-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="pla-tabs" role="tablist" aria-label="Department sections" onKeyDown={onTabKey}>
              <button
                ref={(el) => { tabRefs.current.about = el; }}
                type="button" role="tab" id="pla-tab-about" aria-selected={tab === "about"} aria-controls="pla-panel"
                tabIndex={tab === "about" ? 0 : -1} className={`pla-tab${tab === "about" ? " is-active" : ""}`} onClick={() => pickTab("about")}
              >
                <FiFileText aria-hidden="true" /> {pageLabels.aboutTab || "About"}
              </button>
              <button
                ref={(el) => { tabRefs.current.staff = el; }}
                type="button" role="tab" id="pla-tab-staff" aria-selected={tab === "staff"} aria-controls="pla-panel"
                tabIndex={tab === "staff" ? 0 : -1} className={`pla-tab${tab === "staff" ? " is-active" : ""}`} onClick={() => pickTab("staff")}
              >
                <FiUsers aria-hidden="true" /> {pageLabels.staffTab || "Staff"} <span className="pla-tab__n">{staff.length}</span>
              </button>
            </div>
          </div>

          <div id="pla-panel" className="pla-panel" role="tabpanel" aria-labelledby={`pla-tab-${tab}`} tabIndex={0}>
            {tab === "about" ? (
              <>
                {!q && feature && (
                  <article className="pla-feature">
                    <div className="pla-collage">
                      <Photo src={collage[0].src} alt={collage[0].alt} className="pla-collage__a" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[1].src} alt={collage[1].alt} className="pla-collage__b" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[2].src} alt={collage[2].alt} className="pla-collage__c" placeholder={pageLabels.photoPlaceholder} />
                    </div>
                    <div className="pla-feature__text">
                      <span className="pla-feature__bar" aria-hidden="true" />
                      <h2>{feature.title}</h2>
                      {feature.paragraphs.map((text) => <p key={text}>{text}</p>)}
                      <ul className="pla-tiles">
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
                  <div className="pla-about">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <article key={section.id} className={`pla-block${section.wide ? " pla-block--wide" : ""}`}>
                          <h2><span className="pla-block__icon"><Icon aria-hidden="true" /></span><Mark text={section.title} query={q} /></h2>
                          {section.paragraphs?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                          {section.items?.length > 0 && (
                            <ul className={`pla-items pla-items--${section.view}`}>
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
                  <p className="pla-none">Nothing found for "{query}". Try another word.</p>
                )}
              </>
            ) : people.length > 0 ? (
              <ul className="pla-staff">
                {people.map((person) => (
                  <li key={person.name} className="pla-card">
                    <Avatar person={person} placeholder={pageLabels.photoPlaceholder} />
                    <div className="pla-card__body">
                      <h3><Mark text={person.name} query={q} /></h3>
                      {person.role && <span className="pla-card__role"><Mark text={person.role} query={q} /></span>}
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
                      <a className="pla-card__mail" href={`mailto:${person.email}`}>
                        <FiMail aria-hidden="true" />
                        <span>{person.email}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pla-none">No staff found for "{query}". Try another name or role.</p>
            )}
          </div>
        </section>

        {/* ---- department highlights ---- */}
        <section className="pla-highlights" aria-labelledby="pla-hl-title">
          <header className="pla-head">
            <span className="pla-eyebrow pla-eyebrow--line">{pageLabels.highlightsEyebrow || "At a glance"}</span>
            <h2 id="pla-hl-title">{pageLabels.highlightsTitle || "Department"} <span>{pageLabels.highlightsTitleHighlight || "highlights"}</span></h2>
          </header>
          <ul className="pla-hl">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="pla-hl__card" style={{ "--hl-img": `url("${mediaUrl(item.image)}")` }}>
                  <div className="pla-hl__top">
                    <span className="pla-hl__icon"><Icon aria-hidden="true" /></span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="pla-hl__label">{item.label}</span>
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