// AppliedSciences.jsx - Departments > Applied Sciences (route: /departments/applied-science).
// Page order: hero (same as About / Facilities) -> title block + department picture -> department switcher
//             -> search + About / Staff tabs -> department highlights.
// Own styles (AppliedSciences.css, every class starts with "apl-"). Nothing here is shared with another department.
//
// HOW THE DEPARTMENT UPDATES THIS PAGE - everything is a list at the top of this file:
//   dept         title, short introduction, quick facts and the framed department picture
//   collage      the three About pictures: [small left, small right, large below]
//   about        the About sections (first one = the card with the collage, the rest = cards below it)
//   staff        one object per person: name, role, photo, and OPTIONAL qualification / interest
//                (empty fields are simply not shown - add them whenever they are available)
//   highlights   the four visual cards at the bottom
// Department and collage photos use /images/faculty/applied-sciences/; staff photos remain under /images/departments/applied-sciences/staff/.
// The hero shows /images/pages-banner.png exactly as it is (no tint over it).
// A missing picture shows a clean placeholder, a missing staff photo shows the person's initials.
//
//   hero.jpg, about-1.jpg, about-2.jpg, about-3.jpg -> department picture and About collage under /images/faculty/applied-sciences/
//   /media/teachers/ashok-deswal.jpeg, neelam-malik.jpeg, saveen.jpeg, dinesh-chander.jpeg, Manisha_Hooda.jpg -> manisha-hooda.jpg; ijja.jpg; rinku-rani.jpeg; seema-rani.jpeg; vijeta.png -> matching files under public/images/departments/applied-sciences/staff/
//   highlight-foundation.jpg, highlight-labs.jpg, highlight-language.jpg, highlight-learning.jpg -> backgrounds of the highlight cards
// The banner /images/pages-banner.png is the same one the About / Facilities pages use.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartment, getDepartments, mediaUrl } from "../../services/departmentService";
import PageLoader, { usePageReady } from "../../components/PageLoader";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiChevronRight, FiMapPin, FiSearch, FiX, FiImage, FiInfo, FiLayers, FiBriefcase, FiMonitor, FiAward,
  FiTrendingUp, FiCheckCircle, FiFileText, FiUsers, FiClock, FiUser, FiCalendar, FiBookOpen, FiMail,
} from "react-icons/fi";
import "./AppliedSciences.css";

const IMG = "/images/departments/applied-sciences";
const DEPT_IMG = "/images/faculty/applied-sciences";

// Same banner as the About / Facilities pages (a patterned navy banner shows if it is missing).
const fallbackBanner = "/images/pages-banner.png";

const fallbackDept = {
  title: "Applied Sciences",
  titleLine2: "",
  lead: "Building a strong foundation in communication skills, physics, chemistry and mathematics for engineering studies.",
  facts: [
    { icon: FiBookOpen, text: "Foundation for the first two semesters" },
    { icon: FiLayers, text: "3 department laboratories" },
    { icon: FiUsers, text: "English Language Lab" },
  ],
  image: `${DEPT_IMG}/hero.jpg`,
  imageAlt: "Applied Sciences department",
};

// All eight departments in one row. The same list is repeated in every department file on purpose.
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
const CURRENT = "/departments/applied-science";

// Two small pictures on top, one wide picture below (the layout of the About card).
const fallbackCollage = [
  { src: `${DEPT_IMG}/about-1.jpg`, alt: "Applied Sciences department - picture 1" },
  { src: `${DEPT_IMG}/about-2.jpg`, alt: "Applied Sciences department - picture 2" },
  { src: `${DEPT_IMG}/about-3.jpg`, alt: "Applied Sciences department - picture 3" },
];

// The three small tiles in the About card.
const fallbackAboutTiles = [
  { icon: FiBookOpen, value: "4", label: "Foundation subjects" },
  { icon: FiLayers, value: "3", label: "Department laboratories" },
  { icon: FiUsers, value: "1", label: "English Language Lab" },
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
      "The Applied Sciences Department teaches Communication Skills, Physics, Chemistry and Mathematics during the first two semesters to build a sound foundation in engineering fundamentals.",
      "The department staff works to promote students’ overall development, leadership and self-discipline, while keeping the curriculum record updated according to industry needs.",
    ],
  },
  {
    id: "foundation",
    title: "Engineering foundation",
    icon: FiBookOpen,
    view: "chips",
    paragraphs: ["The first two semesters focus on core subjects that develop a sound base in engineering fundamentals."],
    items: ["Communication Skills", "Physics", "Chemistry", "Mathematics"],
  },
  {
    id: "laboratories",
    title: "Department laboratories",
    icon: FiMonitor,
    view: "chips",
    paragraphs: ["Three separate laboratories are established under the Applied Sciences Department. The department states that all three are equipped to meet the requirements of the latest curriculum."],
    items: ["Physics Laboratory", "Chemistry Laboratory", "Applied Mechanics Laboratory"],
  },
  {
    id: "language-lab",
    title: "English Language Lab",
    icon: FiUsers,
    view: "list",
    wide: true,
    paragraphs: ["The institute has established an English Language Lab to enhance students’ communication skills. The lab is air-conditioned and equipped with personal computers, headphones and microphones."],
    items: [
      "Supports learning of pronunciation, accent and phonetics.",
      "Language-learning software helps develop listening, speaking and comprehension skills.",
      "Students learn through interaction with fellow students under a mentor’s guidance.",
    ],
  },
];

// One object per person (REAL data from each person's page on the live website).
// Every card shows the name, the role, the qualification, and - when you add them - the interested area and the email.
// interest is empty for everyone on the live site, so that row is hidden until you fill it in. email shows as a mailto link.
// The date of birth is NOT shown on purpose (it is personal information).
const fallbackStaff = [
  { name: "Ashok Deswal", role: "Head of Department", photo: `${IMG}/staff/ashok-deswal.jpeg`, qualification: "M.Sc. (Physics), PGDCA, B.Ed., Ph.D.", interest: "", email: "deswalashok143@gmail.com" },
  { name: "Dr. Neelam Malik", role: "Senior Lecturer", photo: `${IMG}/staff/neelam-malik.jpeg`, qualification: "M.A., M.Phil., B.Ed., Ph.D.", interest: "", email: "neelamjesuschrist@gmail.com" },
  { name: "Saveen", role: "Lecturer", photo: `${IMG}/staff/saveen.jpeg`, qualification: "M.Sc. (Mathematics), B.Ed.", interest: "", email: "sheenuishu72@gmail.com" },
  { name: "Dinesh Chander", role: "Lecturer", photo: `${IMG}/staff/dinesh-chander.jpeg`, qualification: "M.Sc., M.Ed.", interest: "", email: "nandaldinesh1969@gmail.com" },
  { name: "Manisha Hooda", role: "Lecturer", photo: `${IMG}/staff/manisha-hooda.jpg`, qualification: "M.Sc. (Chemistry)", interest: "", email: "Manisha020@gmail.com" },
  { name: "Ijja", role: "Lecturer", photo: `${IMG}/staff/ijja.jpg`, qualification: "M.A. in English", interest: "", email: "" },
  { name: "Rinku Rani", role: "Lab Instructor", photo: `${IMG}/staff/rinku-rani.jpeg`, qualification: "M.Sc. (Mathematics)", interest: "", email: "rinku7412@gmail.com" },
  { name: "Seema Rani", role: "Lab Instructor", photo: `${IMG}/staff/seema-rani.jpeg`, qualification: "M.Sc. (Physics)", interest: "", email: "seemarani@crpolytechnic.org" },
  { name: "Vijeta Nandal", role: "Lab Instructor", photo: `${IMG}/staff/vijeta.png`, qualification: "M.A. in English", interest: "", email: "vijetanandal997@gmail.com" },
];

// Four visual cards, real facts from this department's page only.
const fallbackHighlights = [
  {
    icon: FiBookOpen, value: "4", label: "Foundation subjects", image: `${IMG}/highlight-foundation.jpg`,
    text: "Communication Skills, Physics, Chemistry and Mathematics form the first-two-semester foundation.",
  },
  {
    icon: FiLayers, value: "3", label: "Department laboratories", image: `${IMG}/highlight-labs.jpg`,
    text: "Physics, Chemistry and Applied Mechanics laboratories support the department curriculum.",
  },
  {
    icon: FiUsers, value: "1", label: "English Language Lab", image: `${IMG}/highlight-language.jpg`,
    text: "An air-conditioned language lab with computers, headphones and microphones.",
  },
  {
    icon: FiTrendingUp, value: "2", label: "Foundation semesters", image: `${IMG}/highlight-learning.jpg`,
    text: "Students develop a sound base in engineering fundamentals during the first two semesters.",
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
    <figure className={`apl-photo ${className}`}>
      {failed || !src ? (
        <div className="apl-photo__empty" aria-hidden="true">
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
    <div className="apl-avatar">
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

export default function AppliedSciences() {
  const { ready, data: results } = usePageReady(() => Promise.allSettled([getDepartment("applied-science"), getDepartments()]));
  const serverData = results?.[0]?.status === "fulfilled" ? results[0].value : null;
  const departmentList = results?.[1]?.status === "fulfilled" ? results[1].value : null;
  const departmentOptions = Array.isArray(departmentList) && departmentList.length
    ? departmentList.slice().sort((a, b) => a.order - b.order).map((item) => ({ label: item.shortName, to: `/departments/${item.slug}`, slug: item.slug }))
    : fallbackSwitcher;
  const fallbackLabels = {
    eyebrow: "Department", bannerTagLeft: "Government Polytechnic", bannerTagRight: "Rohtak (Haryana)", breadcrumb: "Applied Sciences", switcherLabel: "Department", aboutTab: "About", staffTab: "Staff", searchAbout: "Search the department information", searchStaff: "Search staff by name or role", qualificationLabel: "Qualification", interestLabel: "Interested area", highlightsEyebrow: "At a glance", highlightsTitle: "Department", highlightsTitleHighlight: "highlights", photoPlaceholder: "Photo coming soon", };
  const pageLabels = Object.fromEntries(Object.entries({ ...fallbackLabels, ...(serverData?.labels || {}) }).map(([key, value]) => [key, value || fallbackLabels[key]]));
  const banner = mediaUrl(serverData?.banner || fallbackBanner);
  const dept = serverData ? { ...fallbackDept, ...serverData, facts: (serverData.facts || []).map((item, i) => ({ ...item, icon: fallbackDept.facts[i]?.icon || fallbackDept.facts[0]?.icon })), image: mediaUrl(serverData.image ?? fallbackDept.image) } : fallbackDept;
  const collage = serverData ? (serverData.collage || []).map((item) => ({ ...item, src: mediaUrl(item.src) })) : fallbackCollage;
  const aboutTiles = serverData ? (serverData.tiles || []).map((item, i) => ({ ...item, icon: fallbackAboutTiles[i]?.icon || fallbackAboutTiles[0]?.icon })) : fallbackAboutTiles;
  const about = serverData ? (serverData.about || []).map((item, i) => ({ ...item, icon: fallbackAbout[i]?.icon || fallbackAbout[0]?.icon })) : fallbackAbout;
  const staff = (serverData?.staff || fallbackStaff).filter((person) => [person.name, person.role, person.photo, person.qualification, person.interest, person.email].some(Boolean));
  const highlights = serverData ? (serverData.highlights || []).map((item, i) => ({ ...item, image: mediaUrl(item.image), icon: fallbackHighlights[i]?.icon || fallbackHighlights[0]?.icon })) : fallbackHighlights;
  const switcher = departmentOptions;
  const currentLabel = switcher.find((item) => item.slug === "applied-science" || item.to === CURRENT)?.label || fallbackSwitcher.find((item) => item.to === CURRENT)?.label;

  const [tab, setTab] = useState("about");
  const [query, setQuery] = useState("");
  const tabRefs = useRef({});
  const listRef = useRef(null);

  const q = query.trim().toLowerCase();

  // Scroll the current department pill into view inside the row (sideways only, the page does not jump).
  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector("[aria-current='page']");
    if (!list || !current) return;
    list.scrollLeft = current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2;
  }, []);

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

  if (!ready) return <main id="main" className="apl-page"><PageLoader /></main>;

  return (
    <main id="main" className="apl-page">
      {/* ---- hero (same as About us / Facilities) ---- */}
      <section className="apl-hero" aria-label="Applied Sciences department" style={{ "--img": `url("${banner}")` }}>
        <div className="apl-hero__photo" />
        <div className="apl-hero__tags">
          <span className="apl-hero__tag apl-hero__tag--left">
            <span className="apl-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {pageLabels.bannerTagLeft}
          </span>
          <span className="apl-hero__tag apl-hero__tag--right">
            <span className="apl-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {pageLabels.bannerTagRight}
          </span>
        </div>
        <nav className="apl-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Departments</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{pageLabels.breadcrumb}</span>
        </nav>
      </section>

      <div className="container apl-wrap">
        {/* ---- title block + department picture ---- */}
        <header className="apl-top">
          <div className="apl-top__text">
            <span className="apl-eyebrow">{pageLabels.eyebrow}</span>
            <h1>{dept.title}{dept.titleLine2 && <span>{dept.titleLine2}</span>}</h1>
            <p>{dept.lead}</p>
            <ul className="apl-facts">
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
          <div className="apl-frame">
            <Photo src={dept.image} alt={dept.imageAlt} className="apl-frame__photo" placeholder={pageLabels.photoPlaceholder} />
          </div>
        </header>

        {/* ---- department switcher: all eight in one row ---- */}
        <nav className="apl-switch" aria-label="Departments">
          <ul className="apl-switch__list" ref={listRef}>
            {switcher.map((item) => {
              const isCurrent = item.slug === "applied-science" || item.to === CURRENT;
              return (
                <li key={item.to}>
                  <Link to={item.to} className={`apl-switch__link${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ---- search + tabs ---- */}
        <section className="apl-info" aria-label="Department information">
          <div className="apl-toolbar">
            <label className="apl-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
                aria-label={tab === "about" ? (pageLabels.searchAbout || "Search the department information") : (pageLabels.searchStaff || "Search staff by name or role")}
              />
              {query && (
                <button type="button" className="apl-search__clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="apl-tabs" role="tablist" aria-label="Department sections" onKeyDown={onTabKey}>
              <button
                ref={(el) => { tabRefs.current.about = el; }}
                type="button" role="tab" id="apl-tab-about" aria-selected={tab === "about"} aria-controls="apl-panel"
                tabIndex={tab === "about" ? 0 : -1} className={`apl-tab${tab === "about" ? " is-active" : ""}`} onClick={() => pickTab("about")}
              >
                <FiFileText aria-hidden="true" /> {pageLabels.aboutTab || "About"}
              </button>
              <button
                ref={(el) => { tabRefs.current.staff = el; }}
                type="button" role="tab" id="apl-tab-staff" aria-selected={tab === "staff"} aria-controls="apl-panel"
                tabIndex={tab === "staff" ? 0 : -1} className={`apl-tab${tab === "staff" ? " is-active" : ""}`} onClick={() => pickTab("staff")}
              >
                <FiUsers aria-hidden="true" /> {pageLabels.staffTab || "Staff"} <span className="apl-tab__n">{staff.length}</span>
              </button>
            </div>
          </div>

          <div id="apl-panel" className="apl-panel" role="tabpanel" aria-labelledby={`apl-tab-${tab}`} tabIndex={0}>
            {tab === "about" ? (
              <>
                {!q && feature && (
                  <article className="apl-feature">
                    <div className="apl-collage">
                      <Photo src={collage[0].src} alt={collage[0].alt} className="apl-collage__a" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[1].src} alt={collage[1].alt} className="apl-collage__b" placeholder={pageLabels.photoPlaceholder} />
                      <Photo src={collage[2].src} alt={collage[2].alt} className="apl-collage__c" placeholder={pageLabels.photoPlaceholder} />
                    </div>
                    <div className="apl-feature__text">
                      <span className="apl-feature__bar" aria-hidden="true" />
                      <h2>{feature.title}</h2>
                      {feature.paragraphs.map((text) => <p key={text}>{text}</p>)}
                      <ul className="apl-tiles">
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
                  <div className="apl-about">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <article key={section.id} className={`apl-block${section.wide ? " apl-block--wide" : ""}`}>
                          <h2><span className="apl-block__icon"><Icon aria-hidden="true" /></span><Mark text={section.title} query={q} /></h2>
                          {section.paragraphs?.map((text) => <p key={text}><Mark text={text} query={q} /></p>)}
                          {section.items?.length > 0 && (
                            <ul className={`apl-items apl-items--${section.view}`}>
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
                  <p className="apl-none">Nothing found for "{query}". Try another word.</p>
                )}
              </>
            ) : people.length > 0 ? (
              <ul className="apl-staff">
                {people.map((person) => (
                  <li key={person.name} className="apl-card">
                    <Avatar person={person} placeholder={pageLabels.photoPlaceholder} />
                    <div className="apl-card__body">
                      <h3><Mark text={person.name} query={q} /></h3>
                      {person.role && <span className="apl-card__role"><Mark text={person.role} query={q} /></span>}
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
                      <a className="apl-card__mail" href={`mailto:${person.email}`}>
                        <FiMail aria-hidden="true" />
                        <span>{person.email}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="apl-none">No staff found for "{query}". Try another name or role.</p>
            )}
          </div>
        </section>

        {/* ---- department highlights ---- */}
        <section className="apl-highlights" aria-labelledby="apl-hl-title">
          <header className="apl-head">
            <span className="apl-eyebrow apl-eyebrow--line">{pageLabels.highlightsEyebrow || "At a glance"}</span>
            <h2 id="apl-hl-title">{pageLabels.highlightsTitle || "Department"} <span>{pageLabels.highlightsTitleHighlight || "highlights"}</span></h2>
          </header>
          <ul className="apl-hl">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="apl-hl__card" style={{ "--hl-img": `url("${mediaUrl(item.image)}")` }}>
                  <div className="apl-hl__top">
                    <span className="apl-hl__icon"><Icon aria-hidden="true" /></span>
                    <strong>{item.value}</strong>
                  </div>
                  <span className="apl-hl__label">{item.label}</span>
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