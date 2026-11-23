// Civil.jsx - Departments > Civil Engineering (route: /departments/civil).
// Page order: hero (same as About / Facilities) -> title block + department picture -> department switcher
//             -> search + About / Staff tabs -> department highlights.
// Own styles (Civil.css, every class starts with "civ-"). Nothing here is shared with another department.
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - everything is a list at the top of this file:
//   dept         title, short introduction, quick facts and the framed department picture
//   collage      the three About pictures: [small left, small right, large below]
//   about        the About sections (first one = the card with the collage, the rest = cards below it)
//   staff        one object per person: name, role, photo, and OPTIONAL qualification / interest / email
//                (empty fields are simply not shown - add them whenever they are available)
//   highlights   the four visual cards at the bottom
// Department and collage photos use /images/faculty/civil-engineering/; staff photos remain under /images/departments/civil/staff/.
// A missing picture shows a clean placeholder, a missing staff photo shows the person's initials.
//
//   /media/teachers/<file>   -> public/images/departments/civil/staff/<file>   (photo file names used in the staff list below)
//   hero.jpg, about-1.jpg, about-2.jpg, about-3.jpg -> /images/faculty/civil-engineering/ (department picture and About collage)
//   civil-highlight-*.jpg (4 files named in the highlights list) -> backgrounds of the highlight cards
// The banner /images/pages-banner.png is the same one the About / Facilities pages use.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartment, getDepartments, mediaUrl } from "../../services/departmentService";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiChevronRight, FiMapPin, FiSearch, FiX, FiImage, FiInfo, FiLayers, FiBriefcase, FiMonitor, FiAward, FiTrendingUp,
  FiCheckCircle, FiFileText, FiUsers, FiUser, FiBookOpen, FiMail, FiChevronDown,
} from "react-icons/fi";
import "./Civil.css";

const IMG = "/images/departments/civil";
const DEPT_IMG = "/images/faculty/civil-engineering";

// Same banner as the About / Facilities pages (a patterned navy banner shows if it is missing).
const fallbackBanner = "/images/pages-banner.png";

const fallbackDept = {
  title: "Civil Engineering",
  titleLine2: "",
  lead: "Design, construction and maintenance of the infrastructure a modern nation is built on.",
  facts: [
    { icon: FiBookOpen, text: "3-year diploma" },
    { icon: FiUsers, text: "60 seats" },
    { icon: FiAward, text: "11 placed in 2024" },
  ],
  image: `${DEPT_IMG}/hero.jpg`,
  imageAlt: "Civil Engineering department",
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
const CURRENT = "/departments/civil";
const fallbackCurrentLabel = fallbackSwitcher.find((item) => item.to === CURRENT)?.label;

// Two small pictures on top, one wide picture below (the layout of the About card).
const fallbackCollage = [
  { src: `${DEPT_IMG}/about-1.jpg`, alt: "Civil Engineering department - picture 1" },
  { src: `${DEPT_IMG}/about-2.jpg`, alt: "Civil Engineering department - picture 2" },
  { src: `${DEPT_IMG}/about-3.jpg`, alt: "Civil Engineering department - picture 3" },
];

// The three small tiles in the About card.
const fallbackAboutTiles = [
  { icon: FiMonitor, value: "9", label: "Laboratories" },
  { icon: FiAward, value: "11", label: "Placed in 2024" },
  { icon: FiUsers, value: "60", label: "Seats" },
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
      "The range and application of civil engineering is the broadest and the most visible. In fact, the entire infrastructural framework of a modern nation is the creation of civil engineers. The credit of building mighty power plants, dams, airports, sea ports, highways, inland waterways and industrial plants goes to civil engineers.",
      "These professionals are also engaged in building an unending array of urban structures such as commercial complexes, skyscrapers, tunnels, bridges, roads, urban rapid transport systems, sports stadia and so on.",
    ],
  },
  {
    id: "scope",
    title: "Career scope",
    icon: FiTrendingUp,
    view: "text",
    wide: true,
    paragraphs: [
      "There is huge demand for civil engineers in India and it is also expected to get a boost as the country gets ready to upgrade its infrastructure with growing economic and political clout in the world. The career opens a lot of opportunities in numerous government departments. Civil engineers are employed in all major construction projects carried out by central and state government agencies. There are equally good opportunities in the private sector for civil engineers. A major opening for qualified civil engineers is also in armed forces where they can make vital contribution to the protection of the country.",
      "Construction industry is experiencing a boom in the country and lucrative opportunities are plentiful. You derive the satisfaction of having built numerous structures that facilitate the betterment of the society and the country.",
    ],
  },
  {
    id: "jobs",
    title: "Job prospects",
    icon: FiBriefcase,
    view: "chips",
    items: [
      "Construction engineering", "Hydraulic engineering", "Coastal and ocean engineering", "Transportation engineering",
      "Materials engineering", "Structural engineering", "Earthquake engineering", "Urban engineering", "Environment engineering",
    ],
  },
  {
    id: "careers",
    title: "Career opportunities",
    icon: FiBriefcase,
    view: "chips",
    paragraphs: ["Civil engineers can work in various industries, including:"],
    items: ["Construction companies", "Government agencies", "Consulting firms", "Research institutions", "Academia"],
  },
  {
    id: "overview",
    title: "Overview",
    icon: FiLayers,
    view: "text",
    paragraphs: [
      "The Civil Engineering department is a branch of engineering that deals with the design, construction, and maintenance of physical infrastructure, such as buildings, bridges, roads, and water treatment plants.",
    ],
  },
  {
    id: "skills",
    title: "Skills and knowledge",
    icon: FiBookOpen,
    view: "text",
    paragraphs: [
      "Civil engineers require a strong foundation in mathematics, physics, and materials science, as well as skills in design, analysis, and problem-solving.",
    ],
  },
  {
    id: "focus",
    title: "Key areas of focus",
    icon: FiLayers,
    view: "list",
    wide: true,
    items: [
      "Structural Engineering: Deals with the design and analysis of buildings, bridges, and other structures.",
      "Transportation Engineering: Focuses on the design and development of transportation systems, including roads, highways, and public transportation.",
      "Water Resources Engineering: Concerned with the management and development of water resources, including water supply, treatment, and distribution.",
      "Geotechnical Engineering: Deals with the behavior of earth materials and the design of foundations, tunnels, and other underground structures.",
    ],
  },
  {
    id: "applications",
    title: "Applications",
    icon: FiTrendingUp,
    view: "chips",
    wide: true,
    paragraphs: ["Civil engineers work on a wide range of projects, including:"],
    items: [
      "Building design and construction", "Bridge construction and maintenance", "Road and highway development",
      "Water treatment and supply systems", "Urban planning and development",
    ],
  },
  {
    id: "labs",
    title: "Department laboratories",
    icon: FiMonitor,
    view: "chips",
    wide: true,
    paragraphs: [
      "The various laboratories which are functioning under the Civil Engg. Department are equipped with latest testing & demo. equipments. The students are made conversant with all the modern learning and teaching techniques.",
      "The details of various laboratories established under this department and latest equipment are listed below:",
    ],
    items: [
      "Surveying Lab", "W.S and S.E Lab", "Highway Engineering Lab", "Computer Lab", "Hydraulic Lab", "Soil Testing Lab",
      "Construction Material Lab", "Structure mechanics lab", "Concrete technology lab",
    ],
  },
  {
    id: "placements",
    title: "Placement status (2024)",
    icon: FiAward,
    view: "list",
    wide: true,
    paragraphs: [
      "In the 2024 placement season, the Civil Engineering department achieved notable success, with 11 students securing positions in reputed organizations. The selected students are:",
    ],
    items: [
      "Mr. Daksh S/O Rajesh",
      "Mr. Gourav S/O Paramjeet Gill",
      "Mr. Sanyam Hooda S/O Dharmender",
      "Mr. Shubham Dangi S/O Vijay Kumar",
      "Mr. Rishi S/O Jagmender",
      "Mr. Nikhil S/O Mohan Kumar",
      "Ms. Tannu D/O Bijender Singh",
      "Ms. Tannu D/O Ravinder Kumar",
      "Mr. Ankit Kumar S/O Suresh",
      "Mr. Rahul S/O Narender Kumar",
      "Mr. Chirag S/O Amit Rathee",
    ],
    closing: [
      "These placements reflect the department's commitment to preparing students for rewarding careers in civil engineering and related fields.",
    ],
  },
];

// One object per person (REAL data from each person's page on the live website).
// interest is empty for everyone on the live site, so that row is hidden until you fill it in. email shows as a mailto link.
// The date of birth is NOT shown on purpose (it is personal information).
const fallbackStaff = [
  { name: "Mr Dalbir Singh", role: "Lecturer", photo: `${IMG}/staff/dalbir-singh.jpeg`, qualification: "B.E in Civil engg", interest: "", email: "dsinghsingroha@yahoo.co.in" },
  { name: "Ravi Nandal", role: "Lecturer", photo: `${IMG}/staff/ravi-nandal.jpeg`, qualification: "B.tech in Civil engg., M.E in Construction Technology & Management", interest: "", email: "ravinandal7@gmail.com" },
  { name: "Mr. Vikash Narwal", role: "Lab Instructor", photo: `${IMG}/staff/vikash-narwal.jpeg`, qualification: "B.tech in Civil engg.", interest: "", email: "vikashnarwal1986@gmail.com" },
  { name: "Amarjeet Chhikara", role: "Lecturer", photo: `${IMG}/staff/amarjeet.jpg`, qualification: "Diploma in Civil engineering, B.Tech,M.Tech in Construction Technology & Management", interest: "", email: "luckysingh0707@gmail.com" },
];

// Four visual cards, real facts from this department's page only.
const fallbackHighlights = [
  {
    icon: FiMonitor, value: "9", label: "Laboratories", image: `${IMG}/civil-highlight-labs.jpg`,
    text: "Surveying, Highway Engineering, Hydraulic, Soil Testing, Concrete technology and more.",
  },
  {
    icon: FiAward, value: "11", label: "Placed in 2024", image: `${IMG}/civil-highlight-placements.jpg`,
    text: "Students secured positions in reputed organizations in the 2024 placement season.",
  },
  {
    icon: FiBriefcase, value: "9", label: "Career fields", image: `${IMG}/civil-highlight-careers.jpg`,
    text: "Construction, hydraulic, structural, transportation, earthquake, environment engineering and more.",
  },
  {
    icon: FiUsers, value: "60", label: "Seats", image: `${IMG}/civil-highlight-seats.jpg`,
    text: "A three-year diploma in Civil Engineering.",
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
    <figure className={`civ-photo ${className}`}>
      {failed || !src ? (
        <div className="civ-photo__empty" aria-hidden="true">
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
    <div className="civ-avatar">
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

export default function Civil() {
  const [serverData, setServerData] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(fallbackSwitcher);
  useEffect(() => {
    let active = true;
    getDepartment("civil").then((data) => { if (active) setServerData(data); }).catch(() => {});
    getDepartments().then((list) => {
      if (active && Array.isArray(list) && list.length) setDepartmentOptions(list.slice().sort((a, b) => a.order - b.order).map((item) => ({ label: item.shortName, to: `/departments/${item.slug}`, slug: item.slug })));
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const fallbackLabels = {
    eyebrow: "Department", bannerTagLeft: "Government Polytechnic", bannerTagRight: "Rohtak (Haryana)", breadcrumb: "Civil", switcherLabel: "Department", aboutTab: "About", staffTab: "Staff", searchAbout: "Search the department information", searchStaff: "Search staff by name or role", qualificationLabel: "Qualification", interestLabel: "Interested area", highlightsEyebrow: "At a glance", highlightsTitle: "Department", highlightsTitleHighlight: "highlights", photoPlaceholder: "Photo coming soon", };
  const pageLabels = Object.fromEntries(Object.entries({ ...fallbackLabels, ...(serverData?.labels || {}) }).map(([key, value]) => [key, value || fallbackLabels[key]]));
  const banner = mediaUrl(serverData?.banner || fallbackBanner);
  const dept = serverData ? { ...fallbackDept, ...serverData, facts: (serverData.facts || []).map((item, i) => ({ ...item, icon: fallbackDept.facts[i]?.icon || fallbackDept.facts[0]?.icon })), image: mediaUrl(serverData.image ?? fallbackDept.image) } : fallbackDept;
  const collage = serverData ? (serverData.collage || []).map((item) => ({ ...item, src: mediaUrl(item.src) })) : fallbackCollage;
  const aboutTiles = serverData ? (serverData.tiles || []).map((item, i) => ({ ...item, icon: fallbackAboutTiles[i]?.icon || fallbackAboutTiles[0]?.icon })) : fallbackAboutTiles;
  const about = serverData ? (serverData.about || []).map((item, i) => ({ ...item, icon: fallbackAbout[i]?.icon || fallbackAbout[0]?.icon })) : fallbackAbout;
  const staff = (serverData?.staff || fallbackStaff).filter((person) => [person.name, person.role, person.photo, person.qualification, person.interest, person.email].some(Boolean));
  const highlights = serverData ? (serverData.highlights || []).map((item, i) => ({ ...item, image: mediaUrl(item.image), icon: fallbackHighlights[i]?.icon || fallbackHighlights[0]?.icon })) : fallbackHighlights;
  const switcher = departmentOptions;
  const currentLabel = switcher.find((item) => item.slug === "civil" || item.to === CURRENT)?.label || fallbackCurrentLabel;

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
    <main id="main" className="civ-page">
      {/* ---- hero (same as About us / Facilities) ---- */}
      <section className="civ-hero" aria-label="Civil Engineering department" style={{ "--img": `url("${banner}")` }}>
        <div className="civ-hero__photo" />
        <div className="civ-hero__tags">
          <span className="civ-hero__tag civ-hero__tag--left">
            <span className="civ-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {pageLabels.bannerTagLeft}
          </span>
          <span className="civ-hero__tag civ-hero__tag--right">
            <span className="civ-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {pageLabels.bannerTagRight}
          </span>
        </div>
        <nav className="civ-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Departments</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabels.breadcrumb}</span>
        </nav>
      </section>

      <div className="container civ-wrap">
        {/* ---- title block + department picture ---- */}
        <header className="civ-top">
          <div className="civ-top__text">
            <span className="civ-eyebrow">{pageLabels.eyebrow}</span>
            <h1>{dept.title}{dept.titleLine2 && <span>{dept.titleLine2}</span>}</h1>
            <p>{dept.lead}</p>
            <ul className="civ-facts">
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
          <div className="civ-frame">
            <Photo src={dept.image} alt={dept.imageAlt} className="civ-frame__photo" placeholder={pageLabels.photoPlaceholder} />
          </div>
        </header>

        {/* ---- department switcher: pills on wide screens, a dropdown on small screens ---- */}
        <nav className="civ-switch" aria-label="Departments">
          <ul className="civ-switch__list">
            {switcher.map((item) => {
              const isCurrent = item.slug === "civil" || item.to === CURRENT;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`civ-switch__link${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="civ-switch__menu" ref={menuRef}>
            <button
              type="button"
              className="civ-switch__button"
              aria-expanded={menuOpen}
              aria-controls="civ-switch-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="civ-switch__label">{pageLabels.switcherLabel}</span>
              <span className="civ-switch__current">{currentLabel}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            {menuOpen && (
              <ul id="civ-switch-panel" className="civ-switch__panel">
                {switcher.map((item) => {
                  const isCurrent = item.slug === "civil" || item.to === CURRENT;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`civ-switch__link${isCurrent ? " is-current" : ""}`}
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
        <section className="civ-info" aria-label="Department information">
          <div className="civ-toolbar">
            <label className="civ-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
                aria-label={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
              />
              {query && (
                <button type="button" className="civ-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="civ-tabs" role="tablist" aria-label="Department sections" onKeyDown={onTabKey}>
              <button
                ref={(el) => { tabRefs.current.about = el; }}
                type="button" role="tab" id="civ-tab-about" aria-selected={tab === "about"} aria-controls="civ-panel"
                tabIndex={tab === "about" ? 0 : -1} className={`civ-tab${tab === "about" ? " is-active" : ""}`} onClick={() => pickTab("about")}
              >
                <FiFileText aria-hidden="true" /> {pageLabels.aboutTab || "About"}
              </button>
              <button
                ref={(el) => { tabRefs.current.staff = el; }}
                type="button" role="tab" id="civ-tab-staff" aria-selected={tab === "staff"} aria-controls="civ-panel"
                tabIndex={tab === "staff" ? 0 : -1} className={`civ-tab${tab === "staff" ? " is-active" : ""}`} onClick={() => pickTab("staff")}
              >
                <FiUsers aria-hidden="true" /> {pageLabels.staffTab || "Staff"} <span className="civ-tab__n">{staff.length}</span>
              </button>
            </div>
          </div>

          <div id="civ-panel" className="civ-panel" role="tabpanel" aria-labelledby={`civ-tab-${tab}`} tabIndex={0}>
            {tab === "about" ? (
              <>
                {!q && feature && (
                  <article className="civ-feature">
                    <div className="civ-collage">
                      <Photo src={collage[0].src} alt={collage[0].alt} className="civ-collage__a" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[1].src} alt={collage[1].alt} className="civ-collage__b" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[2].src} alt={collage[2].alt} className="civ-collage__c" placeholder={pageLabels.photoPlaceholder} />
                    </div>
                    <div className="civ-feature__text">
                      <span className="civ-feature__bar" aria-hidden="true" />
                      <h2>{feature.title}</h2>
                      {feature.paragraphs.map((text) => <p key={text}>{text}</p>)}
                      <ul className="civ-tiles">
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
                  <div className="civ-about">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <article key={section.id} className={`civ-block${section.wide ? " civ-block--wide" : ""}`}>
                          <h2><span className="civ-block__icon"><Icon aria-hidden="true" /></span><Mark text={section.title} query={q} /></h2>
                          {section.paragraphs?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                          {section.items?.length > 0 && (
                            <ul className={`civ-items civ-items--${section.view}`}>
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
                  <p className="civ-none">Nothing found for "{query}". Try another word.</p>
                )}
              </>
            ) : people.length > 0 ? (
              <ul className="civ-staff">
                {people.map((person) => (
                  <li key={person.name} className="civ-card">
                    <Avatar person={person} placeholder={pageLabels.photoPlaceholder} />
                    <div className="civ-card__body">
                      <h3><Mark text={person.name} query={q} /></h3>
                      {person.role && <span className="civ-card__role"><Mark text={person.role} query={q} /></span>}
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
                      <a className="civ-card__mail" href={`mailto:${person.email}`}>
                        <FiMail aria-hidden="true" />
                        <span>{person.email}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="civ-none">No staff found for "{query}". Try another name or role.</p>
            )}
          </div>
        </section>

        {/* ---- department highlights ---- */}
        <section className="civ-highlights" aria-labelledby="civ-hl-title">
          <header className="civ-head">
            <span className="civ-eyebrow civ-eyebrow--line">{pageLabels.highlightsEyebrow || "At a glance"}</span>
            <h2 id="civ-hl-title">{pageLabels.highlightsTitle || "Department"} <span>{pageLabels.highlightsTitleHighlight || "highlights"}</span></h2>
          </header>
          <ul className="civ-hl">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="civ-hl__card" style={{ "--hl-img": `url("${mediaUrl(item.image)}")` }}>
                  <div className="civ-hl__top">
                    <span className="civ-hl__icon"><Icon aria-hidden="true" /></span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="civ-hl__label">{item.label}</span>
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