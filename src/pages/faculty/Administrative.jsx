// Administrative.jsx - Departments > Administrative Staff (route: /departments/administrative).
// Page order: hero (same as About / Facilities) -> title block + office picture -> staff navigation
//             -> search + About / Staff tabs -> department highlights.
// Own styles (Administrative.css, every class starts with "adm-"). Nothing here is shared with another department.
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - everything is a list at the top of this file:
//   dept         title, short introduction, quick facts and the framed department picture
//   collage      the three About pictures: [small left, small right, large below]
//   about        the About sections (first one = the card with the collage, the rest = cards below it)
//   staff        one object per person: name, role, photo, and OPTIONAL qualification / interest
//                (empty fields are simply not shown - add them whenever they are available)
//   highlights   the four visual cards at the bottom
// All pictures live in public/images/faculty/administrative/. Missing images intentionally show placeholders.
// The hero shows /images/pages-banner.png exactly as it is (no tint over it).
// A missing picture shows a clean placeholder, a missing staff photo shows the person's initials.
//
//   Add the administrative office hero, collage, staff and highlight images under /images/faculty/administrative/.
//   /media/teachers/<file> -> public/images/faculty/administrative/staff/<file>   (9 photos, same file names as the live site; Meenakshi and Sunder Singh have none, so initials are shown)
// The banner /images/pages-banner.png is the same one the About / Facilities pages use.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartment, getDepartments, mediaUrl } from "../../services/departmentService";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiChevronRight, FiMapPin, FiSearch, FiX, FiImage, FiInfo, FiLayers, FiBriefcase, FiMonitor, FiAward,
  FiTrendingUp, FiCheckCircle, FiFileText, FiUsers, FiClock, FiUser, FiCalendar, FiBookOpen, FiMail, FiChevronDown,
} from "react-icons/fi";
import "./Administrative.css";

const IMG = "/images/faculty/administrative";

// Same banner as the About / Facilities pages (a patterned navy banner shows if it is missing).
const fallbackBanner = "/images/pages-banner.png";

const fallbackDept = {
  title: "Administrative Staff",
  titleLine2: "",
  lead: "Meet the administrative team supporting the day-to-day work of Chhotu Ram Polytechnic, Rohtak.",
  facts: [
    { icon: FiUsers, text: "11 administrative staff members" },
    { icon: FiBriefcase, text: "Office administration" },
    { icon: FiFileText, text: "Institutional support" },
  ],
  image: `${IMG}/administrative-hero.jpg`,
  imageAlt: "Administrative office at Chhotu Ram Polytechnic",
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
const CURRENT = "/departments/administrative";
const fallbackCurrentLabel = fallbackSwitcher.find((item) => item.to === CURRENT)?.label;

// Two small pictures on top, one wide picture below (the layout of the About card).
const fallbackCollage = [
  { src: `${IMG}/administrative-about-1.jpg`, alt: "Administrative office - picture 1" },
  { src: `${IMG}/administrative-about-2.jpg`, alt: "Administrative office - picture 2" },
  { src: `${IMG}/administrative-about-3.jpg`, alt: "Administrative office - picture 3" },
];

const fallbackAboutTiles = [
  { icon: FiUsers, value: "11", label: "Team members" },
  { icon: FiBriefcase, value: "Office", label: "Administration" },
  { icon: FiCheckCircle, value: "Daily", label: "Campus support" },
];

// SAMPLE ABOUT MESSAGE: replace this draft with the institute's approved administrative-office introduction.
const fallbackAbout = [
  {
    id: "intro",
    title: "About the Administrative Office",
    icon: FiInfo,
    view: "text",
    paragraphs: [
      "SAMPLE MESSAGE — The Administrative Office of Chhotu Ram Polytechnic, Rohtak plays an important role in supporting the smooth functioning of the institution. The team works together to assist students, faculty members, visitors and other stakeholders with day-to-day administrative needs.",
      "From maintaining records and coordinating office activities to guiding visitors towards the appropriate services, the administrative staff helps create an organised, responsive and supportive campus environment. This sample introduction can be replaced when the institute provides its official message.",
    ],
  },
  {
    id: "office-coordination",
    title: "Office coordination",
    icon: FiBriefcase,
    view: "text",
    paragraphs: [
      "SAMPLE CONTENT — The office team supports routine institutional coordination and helps direct enquiries to the relevant department or office.",
    ],
  },
  {
    id: "student-assistance",
    title: "Student assistance",
    icon: FiUsers,
    view: "text",
    paragraphs: [
      "SAMPLE CONTENT — Students and visitors can approach the administrative office for general guidance and assistance with the appropriate institutional processes.",
    ],
  },
  {
    id: "records",
    title: "Records and documentation",
    icon: FiFileText,
    view: "text",
    wide: true,
    paragraphs: [
      "SAMPLE CONTENT — Administrative staff help with the organisation and handling of institutional records and routine documentation. Specific responsibilities should be confirmed by the institute before publication.",
    ],
  },
];

// One object per person (REAL data from each person's page on the live website).
// Every card shows the name, the role, the qualification, and - when you add them - the interested area and the email.
// interest is empty for everyone on the live site, so that row is hidden until you fill it in. email shows as a mailto link.
// The date of birth is NOT shown on purpose (it is personal information).
const fallbackStaff = [
  { name: "Samsher Singh", role: "Compounder", photo: `${IMG}/staff/samsher.jpeg`, qualification: "10+2", interest: "", email: "samshermalik098@gmail.com" },
  { name: "Sumit", role: "Clerk", photo: `${IMG}/staff/sumit_exam.jpg`, qualification: "10+2", interest: "", email: "sumitsinghnagar@gmail.com" },
  { name: "Meenakshi", role: "Clerk", photo: "", qualification: "10+2", interest: "", email: "meenakshi874@gmail.com" },
  { name: "Sunder Singh", role: "Clerk", photo: "", qualification: "10+2", interest: "", email: "sunderhooda272@gmail.com" },
  { name: "Saroj Kumari", role: "Steno Typist", photo: `${IMG}/staff/saroj_hooda.jpg`, qualification: "", interest: "", email: "" },
  { name: "Mukesh Kumari", role: "Jr. Scale Steno Typist", photo: `${IMG}/staff/mukesh.jpg`, qualification: "", interest: "", email: "" },
  { name: "Rajiv Kumar", role: "Assistant", photo: `${IMG}/staff/Rajiv_khokhar.jpeg`, qualification: "", interest: "", email: "" },
  { name: "Wazir Singh", role: "Assistant", photo: `${IMG}/staff/wazir.jpeg`, qualification: "", interest: "", email: "" },
  { name: "Jitender", role: "Assistant", photo: `${IMG}/staff/JITENDER.jpeg`, qualification: "", interest: "", email: "" },
  { name: "Krishan Kumar", role: "Lab Attendant", photo: `${IMG}/staff/krishan.jpg`, qualification: "", interest: "", email: "" },
  { name: "Parvesh Kumari", role: "Jr. Librarian", photo: `${IMG}/staff/PARVESH.jpg`, qualification: "", interest: "", email: "" },
];

// Four visual cards, real facts from this department's page only.
const fallbackHighlights = [
  { icon: FiUsers, value: "11", label: "Administrative staff", image: `${IMG}/highlight-team.jpg`, text: "The current administrative staff list published by the institute includes 11 team members." },
  { icon: FiBriefcase, value: "Office", label: "Coordination", image: `${IMG}/highlight-office.jpg`, text: "The administrative office supports routine institutional coordination." },
  { icon: FiFileText, value: "Records", label: "Documentation", image: `${IMG}/highlight-records.jpg`, text: "The office helps with institutional records and routine documentation." },
  { icon: FiCheckCircle, value: "Support", label: "Campus services", image: `${IMG}/highlight-support.jpg`, text: "The team helps guide students and visitors towards the appropriate office services." },
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
    <figure className={`adm-photo ${className}`}>
      {failed || !src ? (
        <div className="adm-photo__empty" aria-hidden="true">
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
    <div className="adm-avatar">
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

export default function Administrative() {
  const [serverData, setServerData] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(fallbackSwitcher);
  useEffect(() => {
    let active = true;
    getDepartment("administrative").then((data) => { if (active) setServerData(data); }).catch(() => {});
    getDepartments().then((list) => {
      if (active && Array.isArray(list) && list.length) setDepartmentOptions(list.slice().sort((a, b) => a.order - b.order).map((item) => ({ label: item.shortName, to: `/departments/${item.slug}`, slug: item.slug })));
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const fallbackLabels = {
    eyebrow: "Faculty", bannerTagLeft: "Government Polytechnic", bannerTagRight: "Rohtak (Haryana)", breadcrumb: "Administrative Staff", switcherLabel: "Staff", aboutTab: "About", staffTab: "Staff", searchAbout: "Search administrative information", searchStaff: "Search staff by name or role", qualificationLabel: "Qualification", interestLabel: "Interested area", highlightsEyebrow: "At a glance", highlightsTitle: "Administrative", highlightsTitleHighlight: "overview", photoPlaceholder: "Photo coming soon", };
  const pageLabels = Object.fromEntries(Object.entries({ ...fallbackLabels, ...(serverData?.labels || {}) }).map(([key, value]) => [key, value || fallbackLabels[key]]));
  const banner = mediaUrl(serverData?.banner || fallbackBanner);
  const dept = serverData ? { ...fallbackDept, ...serverData, facts: (serverData.facts || []).map((item, i) => ({ ...item, icon: fallbackDept.facts[i]?.icon || fallbackDept.facts[0]?.icon })), image: mediaUrl(serverData.image ?? fallbackDept.image) } : fallbackDept;
  const collage = serverData ? (serverData.collage || []).map((item) => ({ ...item, src: mediaUrl(item.src) })) : fallbackCollage;
  const aboutTiles = serverData ? (serverData.tiles || []).map((item, i) => ({ ...item, icon: fallbackAboutTiles[i]?.icon || fallbackAboutTiles[0]?.icon })) : fallbackAboutTiles;
  const about = serverData ? (serverData.about || []).map((item, i) => ({ ...item, icon: fallbackAbout[i]?.icon || fallbackAbout[0]?.icon })) : fallbackAbout;
  const staff = (serverData?.staff || fallbackStaff).filter((person) => [person.name, person.role, person.photo, person.qualification, person.interest, person.email].some(Boolean));
  const highlights = serverData ? (serverData.highlights || []).map((item, i) => ({ ...item, image: mediaUrl(item.image), icon: fallbackHighlights[i]?.icon || fallbackHighlights[0]?.icon })) : fallbackHighlights;
  const switcher = departmentOptions;
  const currentLabel = switcher.find((item) => item.slug === "administrative" || item.to === CURRENT)?.label || fallbackCurrentLabel;

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
    <main id="main" className="adm-page">
      {/* ---- hero (same as About us / Facilities) ---- */}
      <section className="adm-hero" aria-label="Administrative Staff" style={{ "--img": `url("${banner}")` }}>
        <div className="adm-hero__photo" />
        <div className="adm-hero__tags">
          <span className="adm-hero__tag adm-hero__tag--left">
            <span className="adm-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {pageLabels.bannerTagLeft}
          </span>
          <span className="adm-hero__tag adm-hero__tag--right">
            <span className="adm-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {pageLabels.bannerTagRight}
          </span>
        </div>
        <nav className="adm-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Departments</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabels.breadcrumb}</span>
        </nav>
      </section>

      <div className="container adm-wrap">
        {/* ---- title block + department picture ---- */}
        <header className="adm-top">
          <div className="adm-top__text">
            <span className="adm-eyebrow">{pageLabels.eyebrow}</span>
            <h1>{dept.title}{dept.titleLine2 && <span>{dept.titleLine2}</span>}</h1>
            <p>{dept.lead}</p>
            <ul className="adm-facts">
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
          <div className="adm-frame">
            <Photo src={dept.image} alt={dept.imageAlt} className="adm-frame__photo" placeholder={pageLabels.photoPlaceholder} />
          </div>
        </header>

        {/* ---- staff section navigation: pills on wide screens, a dropdown on small screens ---- */}
        <nav className="adm-switch" aria-label="Departments">
          <ul className="adm-switch__list">
            {switcher.map((item) => {
              const isCurrent = item.slug === "administrative" || item.to === CURRENT;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`adm-switch__link${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="adm-switch__menu" ref={menuRef}>
            <button
              type="button"
              className="adm-switch__button"
              aria-expanded={menuOpen}
              aria-controls="adm-switch-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="adm-switch__label">Staff</span>
              <span className="adm-switch__current">{currentLabel}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            {menuOpen && (
              <ul id="adm-switch-panel" className="adm-switch__panel">
                {switcher.map((item) => {
                  const isCurrent = item.slug === "administrative" || item.to === CURRENT;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`adm-switch__link${isCurrent ? " is-current" : ""}`}
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
        <section className="adm-info" aria-label="Administrative staff information">
          <div className="adm-toolbar">
            <label className="adm-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === "about" ? "Search administrative information" : "Search staff by name or role"}
                aria-label={tab === "about" ? "Search administrative information" : "Search staff"}
              />
              {query && (
                <button type="button" className="adm-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="adm-tabs" role="tablist" aria-label="Administrative staff sections" onKeyDown={onTabKey}>
              <button
                ref={(el) => { tabRefs.current.about = el; }}
                type="button" role="tab" id="adm-tab-about" aria-selected={tab === "about"} aria-controls="adm-panel"
                tabIndex={tab === "about" ? 0 : -1} className={`adm-tab${tab === "about" ? " is-active" : ""}`} onClick={() => pickTab("about")}
              >
                <FiFileText aria-hidden="true" /> {pageLabels.aboutTab || "About"}
              </button>
              <button
                ref={(el) => { tabRefs.current.staff = el; }}
                type="button" role="tab" id="adm-tab-staff" aria-selected={tab === "staff"} aria-controls="adm-panel"
                tabIndex={tab === "staff" ? 0 : -1} className={`adm-tab${tab === "staff" ? " is-active" : ""}`} onClick={() => pickTab("staff")}
              >
                <FiUsers aria-hidden="true" /> {pageLabels.staffTab || "Staff"} <span className="adm-tab__n">{staff.length}</span>
              </button>
            </div>
          </div>

          <div id="adm-panel" className="adm-panel" role="tabpanel" aria-labelledby={`adm-tab-${tab}`} tabIndex={0}>
            {tab === "about" ? (
              <>
                {!q && feature && (
                  <article className="adm-feature">
                    <div className="adm-collage">
                      <Photo src={collage[0].src} alt={collage[0].alt} className="adm-collage__a" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[1].src} alt={collage[1].alt} className="adm-collage__b" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[2].src} alt={collage[2].alt} className="adm-collage__c" placeholder={pageLabels.photoPlaceholder} />
                    </div>
                    <div className="adm-feature__text">
                      <span className="adm-feature__bar" aria-hidden="true" />
                      <h2>{feature.title}</h2>
                      {feature.paragraphs.map((text) => <p key={text}>{text}</p>)}
                      <ul className="adm-tiles">
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
                  <div className="adm-about">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <article key={section.id} className={`adm-block${section.wide ? " adm-block--wide" : ""}`}>
                          <h2><span className="adm-block__icon"><Icon aria-hidden="true" /></span><Mark text={section.title} query={q} /></h2>
                          {section.paragraphs?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                          {section.items?.length > 0 && (
                            <ul className={`adm-items adm-items--${section.view}`}>
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
                  <p className="adm-none">Nothing found for "{query}". Try another word.</p>
                )}
              </>
            ) : people.length > 0 ? (
              <ul className="adm-staff">
                {people.map((person) => (
                  <li key={person.name} className="adm-card">
                    <Avatar person={person} placeholder={pageLabels.photoPlaceholder} />
                    <div className="adm-card__body">
                      <h3><Mark text={person.name} query={q} /></h3>
                      {person.role && <span className="adm-card__role"><Mark text={person.role} query={q} /></span>}
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
                      <a className="adm-card__mail" href={`mailto:${person.email}`}>
                        <FiMail aria-hidden="true" />
                        <span>{person.email}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="adm-none">No staff found for "{query}". Try another name or role.</p>
            )}
          </div>
        </section>

        {/* ---- department highlights ---- */}
        <section className="adm-highlights" aria-labelledby="adm-hl-title">
          <header className="adm-head">
            <span className="adm-eyebrow adm-eyebrow--line">{pageLabels.highlightsEyebrow || "At a glance"}</span>
            <h2 id="adm-hl-title">Administrative <span>overview</span></h2>
          </header>
          <ul className="adm-hl">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="adm-hl__card" style={{ "--hl-img": `url("${mediaUrl(item.image)}")` }}>
                  <div className="adm-hl__top">
                    <span className="adm-hl__icon"><Icon aria-hidden="true" /></span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="adm-hl__label">{item.label}</span>
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