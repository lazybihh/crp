// Workshop.jsx - Departments > Workshop Department (route: /departments/workshop).
// Page order: hero (same as About / Facilities) -> title block + department picture -> department switcher
//             -> search + About / Staff tabs -> department highlights.
// Own styles (Workshop.css, every class starts with "wor-"). Nothing here is shared with another department.
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - everything is a list at the top of this file:
//   dept         title, short introduction, quick facts and the framed department picture
//   collage      the three About pictures: [small left, small right, large below]
//   about        the About sections (first one = the card with the collage, the rest = cards below it)
//   staff        one object per person: name, role, photo, and OPTIONAL qualification / interest
//                (empty fields are simply not shown - add them whenever they are available)
//   highlights   the four visual cards at the bottom
// Department and collage photos use /images/faculty/workshop/; staff photos remain under /images/departments/workshop/staff/.
// The hero shows /images/pages-banner.png exactly as it is (no tint over it).
// A missing picture shows a clean placeholder, a missing staff photo shows the person's initials.
//
//   /media/teachers/<name>.jpeg               -> public/images/departments/workshop/staff/<name>.jpeg   (9 photos, same file names as the live site, see `staff` below)
//   hero.jpg, about-1.jpg, about-2.jpg, about-3.jpg -> /images/faculty/workshop/ (department picture and About collage)
//   highlight-staff.jpg, highlight-instructors.jpg, highlight-superintendent.jpg, highlight-foreman.jpg -> backgrounds of the highlight cards
// The banner /images/pages-banner.png is the same one the About / Facilities pages use.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartment, getDepartments, mediaUrl } from "../../services/departmentService";
import PageLoader, { usePageReady } from "../../components/PageLoader";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiChevronRight, FiMapPin, FiSearch, FiX, FiImage, FiInfo, FiLayers, FiCheckCircle, FiFileText, FiUsers,
  FiUser, FiMail, FiChevronDown, FiTool,
} from "react-icons/fi";
import "./Workshop.css";

const IMG = "/images/departments/workshop";
const DEPT_IMG = "/images/faculty/workshop";

// Same banner as the About / Facilities pages (a patterned navy banner shows if it is missing).
const fallbackBanner = "/images/pages-banner.png";

const fallbackDept = {
  title: "Workshop Department",
  titleLine2: "",
  // Taken from the Courses page of this project; check it against the live Workshop page when its text is available.
  lead: "An intensive, short-duration hands-on learning experience.",
  facts: [
    // Counted from the live staff page (10 people listed).
    { icon: FiUsers, text: "10 staff members" },
  ],
  image: `${DEPT_IMG}/hero.jpg`,
  imageAlt: "Workshop Department",
};

// All nine departments. Wide screens show them as a row of pills, small screens as a dropdown.
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
const CURRENT = "/departments/workshop";
const fallbackCurrentLabel = fallbackSwitcher.find((item) => item.to === CURRENT)?.label;

// Two small pictures on top, one wide picture below (the layout of the About card).
const fallbackCollage = [
  { src: `${DEPT_IMG}/about-1.jpg`, alt: "Workshop Department - picture 1" },
  { src: `${DEPT_IMG}/about-2.jpg`, alt: "Workshop Department - picture 2" },
  { src: `${DEPT_IMG}/about-3.jpg`, alt: "Workshop Department - picture 3" },
];

// The three small tiles in the About card.
// PROVISIONAL: counted from the live staff page until the text of the live Workshop page is available.
const fallbackAboutTiles = [
  { icon: FiUsers, value: "10", label: "Staff members" },
  { icon: FiTool, value: "6", label: "Workshop Instructors" },
  { icon: FiUser, value: "1", label: "Workshop Superintendent" },
];

// view: "text" = paragraphs only, "chips" = items shown as chips, "list" = items shown as a tick list.
// paragraphs come before the items, closing paragraphs after them. The FIRST section sits in the card beside the collage.
// PLACEHOLDER: the live Workshop page (https://crprohtak.ac.in/wor) could not be read, so no department text is invented here.
// Paste its sections into this list (introduction first) when the text is available.
const fallbackAbout = [
  {
    id: "intro",
    title: "About the Department",
    icon: FiInfo,
    view: "text",
    paragraphs: [
      "The description of the Workshop Department will be added here soon.", // PLACEHOLDER
    ],
  },
];

// One object per person (names, roles and photo file names are REAL data from the live staff page, in the same order).
// qualification and email are typed exactly as on each person's "View" page (https://crprohtak.ac.in/facultydce2/<n>/).
// interest is empty for everyone on the live site, so that row stays hidden until you fill it in. email shows as a mailto link.
// Mr. Yudhvir Singh has no email here yet: his screenshot did not show it (a person with no email simply has no email row).
// The date of birth is NOT shown on purpose (it is personal information).
const fallbackStaff = [
  { name: "Mr Sandeep Kumar", role: "Instrument Repairer", photo: `${IMG}/staff/mr-sandeep-kumar.jpeg`, qualification: "I.T.I", interest: "", email: "sandeepk.rtk.sk@gmail.com" },
  { name: "Mr. Vijay Pal", role: "Workshop Instructor", photo: `${IMG}/staff/Vjaypal_Bhanwala.jpeg`, qualification: "I.T.I", interest: "", email: "vijaypal_bhanwala@gmail.com" },
  { name: "Mr. Yudhvir Singh", role: "Workshop Instructor", photo: `${IMG}/staff/Yudhvir_Singh.jpeg`, qualification: "I.T.I", interest: "" },
  { name: "Rajeev", role: "Workshop Instructor", photo: `${IMG}/staff/rajeev.jpeg`, qualification: "I.T.I", interest: "", email: "rr54169@gmail.com" },
  { name: "Harvinder", role: "Workshop Instructor", photo: `${IMG}/staff/harvinder.jpeg`, qualification: "Diploma in Mechanical Engg", interest: "", email: "harvinder57@gmail.com" },
  { name: "Mr. Surender Singh", role: "Workshop Instructor", photo: `${IMG}/staff/surender-singh.jpeg`, qualification: "Diploma", interest: "", email: "ssgothwal@gmail.com" },
  { name: "Mr. Avnish", role: "Workshop Instructor", photo: `${IMG}/staff/Avnish_Dhiman.jpeg`, qualification: "Diploma", interest: "", email: "avnishdhiman608@gmail.com" },
  { name: "Mr. Balraj Singh", role: "Draftsman", photo: "", qualification: "Diploma", interest: "", email: "balrajsingh@crpolytechnic.org" }, // no photo on the live site: initials show
  { name: "J.S.BOORA", role: "Workshop Superintendent", photo: `${IMG}/staff/J.S.Boora.jpeg`, qualification: "Diploma in Mech. Engg.", interest: "", email: "boorajagbir@gmail.com" },
  { name: "Raju Nandal", role: "Foreman Instructor", photo: `${IMG}/staff/Raju_Nandal.jpeg`, qualification: "ITI & CTI", interest: "", email: "rajunandal1966@gmail.com" },
];

// Four visual cards. PROVISIONAL: counted from the live staff page until the text of the live Workshop page is available.
const fallbackHighlights = [
  {
    icon: FiUsers, value: "10", label: "Staff members", image: `${IMG}/highlight-staff.jpg`,
    text: "Instrument Repairer, Workshop Instructors, Draftsman, Workshop Superintendent and Foreman Instructor.",
  },
  {
    icon: FiTool, value: "6", label: "Workshop Instructors", image: `${IMG}/highlight-instructors.jpg`,
    text: "Mr. Vijay Pal, Mr. Yudhvir Singh, Rajeev, Harvinder, Mr. Surender Singh and Mr. Avnish.",
  },
  {
    icon: FiUser, value: "1", label: "Workshop Superintendent", image: `${IMG}/highlight-superintendent.jpg`,
    text: "J.S.BOORA.",
  },
  {
    icon: FiLayers, value: "1", label: "Foreman Instructor", image: `${IMG}/highlight-foreman.jpg`,
    text: "Raju Nandal.",
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
    <figure className={`wor-photo ${className}`}>
      {failed || !src ? (
        <div className="wor-photo__empty" aria-hidden="true">
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
    <div className="wor-avatar">
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

export default function Workshop() {
  const { ready, data: results } = usePageReady(() => Promise.allSettled([getDepartment("workshop"), getDepartments()]));
  const serverData = results?.[0]?.status === "fulfilled" ? results[0].value : null;
  const departmentList = results?.[1]?.status === "fulfilled" ? results[1].value : null;
  const departmentOptions = Array.isArray(departmentList) && departmentList.length
    ? departmentList.slice().sort((a, b) => a.order - b.order).map((item) => ({ label: item.shortName, to: `/departments/${item.slug}`, slug: item.slug }))
    : fallbackSwitcher;
  const fallbackLabels = {
    eyebrow: "Department", bannerTagLeft: "Government Polytechnic", bannerTagRight: "Rohtak (Haryana)", breadcrumb: "Workshop", switcherLabel: "Department", aboutTab: "About", staffTab: "Staff", searchAbout: "Search the department information", searchStaff: "Search staff by name or role", qualificationLabel: "Qualification", interestLabel: "Interested area", highlightsEyebrow: "At a glance", highlightsTitle: "Department", highlightsTitleHighlight: "highlights", photoPlaceholder: "Photo coming soon", };
  const pageLabels = Object.fromEntries(Object.entries({ ...fallbackLabels, ...(serverData?.labels || {}) }).map(([key, value]) => [key, value || fallbackLabels[key]]));
  const banner = mediaUrl(serverData?.banner || fallbackBanner);
  const dept = serverData ? { ...fallbackDept, ...serverData, facts: (serverData.facts || []).map((item, i) => ({ ...item, icon: fallbackDept.facts[i]?.icon || fallbackDept.facts[0]?.icon })), image: mediaUrl(serverData.image ?? fallbackDept.image) } : fallbackDept;
  const collage = serverData ? (serverData.collage || []).map((item) => ({ ...item, src: mediaUrl(item.src) })) : fallbackCollage;
  const aboutTiles = serverData ? (serverData.tiles || []).map((item, i) => ({ ...item, icon: fallbackAboutTiles[i]?.icon || fallbackAboutTiles[0]?.icon })) : fallbackAboutTiles;
  const about = serverData ? (serverData.about || []).map((item, i) => ({ ...item, icon: fallbackAbout[i]?.icon || fallbackAbout[0]?.icon })) : fallbackAbout;
  const staff = (serverData?.staff || fallbackStaff).filter((person) => [person.name, person.role, person.photo, person.qualification, person.interest, person.email].some(Boolean));
  const highlights = serverData ? (serverData.highlights || []).map((item, i) => ({ ...item, image: mediaUrl(item.image), icon: fallbackHighlights[i]?.icon || fallbackHighlights[0]?.icon })) : fallbackHighlights;
  const switcher = departmentOptions;
  const currentLabel = switcher.find((item) => item.slug === "workshop" || item.to === CURRENT)?.label || fallbackCurrentLabel;

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

  if (!ready) return <main id="main" className="wor-page"><PageLoader /></main>;

  return (
    <main id="main" className="wor-page">
      {/* ---- hero (same as About us / Facilities) ---- */}
      <section className="wor-hero" aria-label="Workshop Department" style={{ "--img": `url("${banner}")` }}>
        <div className="wor-hero__photo" />
        <div className="wor-hero__tags">
          <span className="wor-hero__tag wor-hero__tag--left">
            <span className="wor-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {pageLabels.bannerTagLeft}
          </span>
          <span className="wor-hero__tag wor-hero__tag--right">
            <span className="wor-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {pageLabels.bannerTagRight}
          </span>
        </div>
        <nav className="wor-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Departments</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabels.breadcrumb}</span>
        </nav>
      </section>

      <div className="container wor-wrap">
        {/* ---- title block + department picture ---- */}
        <header className="wor-top">
          <div className="wor-top__text">
            <span className="wor-eyebrow">{pageLabels.eyebrow}</span>
            <h1>{dept.title}{dept.titleLine2 && <span>{dept.titleLine2}</span>}</h1>
            <p>{dept.lead}</p>
            <ul className="wor-facts">
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
          <div className="wor-frame">
            <Photo src={dept.image} alt={dept.imageAlt} className="wor-frame__photo" placeholder={pageLabels.photoPlaceholder} />
          </div>
        </header>

        {/* ---- department switcher: pills on wide screens, a dropdown on small screens ---- */}
        <nav className="wor-switch" aria-label="Departments">
          <ul className="wor-switch__list">
            {switcher.map((item) => {
              const isCurrent = item.slug === "workshop" || item.to === CURRENT;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`wor-switch__link${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="wor-switch__menu" ref={menuRef}>
            <button
              type="button"
              className="wor-switch__button"
              aria-expanded={menuOpen}
              aria-controls="wor-switch-panel"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="wor-switch__label">{pageLabels.switcherLabel}</span>
              <span className="wor-switch__current">{currentLabel}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            {menuOpen && (
              <ul id="wor-switch-panel" className="wor-switch__panel">
                {switcher.map((item) => {
                  const isCurrent = item.slug === "workshop" || item.to === CURRENT;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`wor-switch__link${isCurrent ? " is-current" : ""}`}
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
        <section className="wor-info" aria-label="Department information">
          <div className="wor-toolbar">
            <label className="wor-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
                aria-label={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
              />
              {query && (
                <button type="button" className="wor-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="wor-tabs" role="tablist" aria-label="Department sections" onKeyDown={onTabKey}>
              <button
                ref={(el) => { tabRefs.current.about = el; }}
                type="button" role="tab" id="wor-tab-about" aria-selected={tab === "about"} aria-controls="wor-panel"
                tabIndex={tab === "about" ? 0 : -1} className={`wor-tab${tab === "about" ? " is-active" : ""}`} onClick={() => pickTab("about")}
              >
                <FiFileText aria-hidden="true" /> {pageLabels.aboutTab || "About"}
              </button>
              <button
                ref={(el) => { tabRefs.current.staff = el; }}
                type="button" role="tab" id="wor-tab-staff" aria-selected={tab === "staff"} aria-controls="wor-panel"
                tabIndex={tab === "staff" ? 0 : -1} className={`wor-tab${tab === "staff" ? " is-active" : ""}`} onClick={() => pickTab("staff")}
              >
                <FiUsers aria-hidden="true" /> {pageLabels.staffTab || "Staff"} <span className="wor-tab__n">{staff.length}</span>
              </button>
            </div>
          </div>

          <div id="wor-panel" className="wor-panel" role="tabpanel" aria-labelledby={`wor-tab-${tab}`} tabIndex={0}>
            {tab === "about" ? (
              <>
                {!q && feature && (
                  <article className="wor-feature">
                    <div className="wor-collage">
                      <Photo src={collage[0].src} alt={collage[0].alt} className="wor-collage__a" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[1].src} alt={collage[1].alt} className="wor-collage__b" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[2].src} alt={collage[2].alt} className="wor-collage__c" placeholder={pageLabels.photoPlaceholder} />
                    </div>
                    <div className="wor-feature__text">
                      <span className="wor-feature__bar" aria-hidden="true" />
                      <h2>{feature.title}</h2>
                      {feature.paragraphs.map((text) => <p key={text}>{text}</p>)}
                      <ul className="wor-tiles">
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
                  <div className="wor-about">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <article key={section.id} className={`wor-block${section.wide ? " wor-block--wide" : ""}`}>
                          <h2><span className="wor-block__icon"><Icon aria-hidden="true" /></span><Mark text={section.title} query={q} /></h2>
                          {section.paragraphs?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                          {section.items?.length > 0 && (
                            <ul className={`wor-items wor-items--${section.view}`}>
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
                  // only while searching: a department with just the intro card has no other cards and nothing is "missing"
                  q && <p className="wor-none">Nothing found for "{query}". Try another word.</p>
                )}
              </>
            ) : people.length > 0 ? (
              <ul className="wor-staff">
                {people.map((person) => (
                  <li key={person.name} className="wor-card">
                    <Avatar person={person} placeholder={pageLabels.photoPlaceholder} />
                    <div className="wor-card__body">
                      <h3><Mark text={person.name} query={q} /></h3>
                      {person.role && <span className="wor-card__role"><Mark text={person.role} query={q} /></span>}
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
                      <a className="wor-card__mail" href={`mailto:${person.email}`}>
                        <FiMail aria-hidden="true" />
                        <span>{person.email}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="wor-none">No staff found for "{query}". Try another name or role.</p>
            )}
          </div>
        </section>

        {/* ---- department highlights ---- */}
        <section className="wor-highlights" aria-labelledby="wor-hl-title">
          <header className="wor-head">
            <span className="wor-eyebrow wor-eyebrow--line">{pageLabels.highlightsEyebrow || "At a glance"}</span>
            <h2 id="wor-hl-title">{pageLabels.highlightsTitle || "Department"} <span>{pageLabels.highlightsTitleHighlight || "highlights"}</span></h2>
          </header>
          <ul className="wor-hl">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="wor-hl__card" style={{ "--hl-img": `url("${mediaUrl(item.image)}")` }}>
                  <div className="wor-hl__top">
                    <span className="wor-hl__icon"><Icon aria-hidden="true" /></span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="wor-hl__label">{item.label}</span>
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