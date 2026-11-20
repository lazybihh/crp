// Courses.jsx - About us > Courses offered (route: /about/courses).
// This page has its own hero, its own styles (courses.css, every class starts with "crs-") and its own downloads sidebar.
// Course names, seats and descriptions are the same as on the Home page. Admission and exam facts come from the live site.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight, FiFileText, FiDownload, FiBox, FiCpu, FiZap, FiRadio, FiSettings, FiDroplet, FiBookOpen,
  FiTool, FiArrowRight, FiExternalLink,
} from "react-icons/fi";
import "./Courses.css";
import { useSite } from "../../context/SiteSettingsContext";

const hero = { image: "/images/pages-banner.png" };

const intro = {
  eyebrow: "About us",
  title: "Courses offered",
  lead: "Six three-year diplomas approved by DTE Haryana and AICTE, supported by two foundation departments.",
};

const courses = [
  { id: "civil", name: "Civil Engineering", icon: FiBox, seats: 60, text: "One of the broadest engineering fields - buildings, roads, water and the structures around us." },
  { id: "computer", name: "Computer Engineering", icon: FiCpu, seats: 54, text: "Software development and testing, networking and hardware." },
  { id: "electrical", name: "Electrical Engineering", icon: FiZap, seats: 60, text: "Power, machines and control, taught with a mission of high-quality education." },
  { id: "electronics", name: "Electronics & Communication", icon: FiRadio, seats: 54, text: "The study and application of physics to design and operate electronic devices." },
  { id: "mechanical", name: "Mechanical Engineering", icon: FiSettings, seats: 60, text: "Design, development, building and testing of things that move." },
  { id: "plastic", name: "Plastic Technology", icon: FiDroplet, seats: 54, text: "How plastics replace everyday and engineering items - materials, moulding and processing." },
];

const foundation = [
  { id: "applied-science", name: "Applied Sciences", icon: FiBookOpen, text: "Communication skills, physics, chemistry and mathematics in the first two semesters." },
  { id: "workshop", name: "Workshop Department", icon: FiTool, text: "An intensive, short-duration hands-on learning experience." },
];


const downloads = [
  { label: "Extension of Approval, 2025-26", href: "/docs/extension-of-approval-2025-26.pdf", type: "PDF" },
  { label: "Academic calendar, 2025-26", href: "/docs/academic-calendar-2025-26.pdf", type: "PDF" },
];

export default function Courses() {
  const { links } = useSite();
  const admission = [
    { title: "Admissions", text: "Admissions to the diploma programmes run through the state technical admissions portal.", label: "Admissions portal", href: links?.admissionPortal || "" },
    { title: "Examinations", text: "Examinations are conducted by the Haryana State Board of Technical Education, Panchkula.", label: "HSBTE", href: links?.hsbte || "" },
  ].filter((item) => item.href);
  const totalSeats = courses.reduce((sum, course) => sum + course.seats, 0);

  return (
    <main id="main" className="crs-page">
      {/* ---- hero ---- */}
      <section className="crs-hero" aria-label="Courses offered" style={{ "--img": `url("${hero.image}")` }}>
        <div className="crs-hero__photo" />
        <div className="crs-hero__tags">
          <span className="crs-hero__tag crs-hero__tag--left">
            <span className="crs-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="crs-hero__tag crs-hero__tag--right">
            <span className="crs-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="crs-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Courses offered</span>
        </nav>
      </section>

      <div className="container crs-layout">
        <div className="crs-content">
          {/* ---- title (level with the downloads card) ---- */}
          <header className="crs-intro">
            <span className="crs-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <dl className="crs-summary">
            <div><dt>{courses.length}</dt><dd>Diploma programmes</dd></div>
            <div><dt>{totalSeats}</dt><dd>Approved seats</dd></div>
            <div><dt>3 years</dt><dd>Duration of each diploma</dd></div>
          </dl>

          <section className="crs-block" aria-labelledby="crs-list-title">
            <header className="crs-head">
              <span className="crs-eyebrow crs-eyebrow--dark">Diploma programmes</span>
              <h2 id="crs-list-title">Choose your branch</h2>
            </header>
            <div className="crs-grid">
              {courses.map((course, index) => {
                const Icon = course.icon;
                return (
                  <article key={course.id} className="crs-card">
                    <span className="crs-card__no">0{index + 1}</span>
                    <span className="crs-card__icon"><Icon aria-hidden="true" /></span>
                    <h3>{course.name}</h3>
                    <p>{course.text}</p>
                    <div className="crs-card__foot">
                      <span className="crs-card__seats">{course.seats} seats</span>
                      <Link to={`/departments/${course.id}`}>Explore department <FiArrowRight aria-hidden="true" /></Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="crs-block" aria-labelledby="crs-found-title">
            <header className="crs-head">
              <span className="crs-eyebrow crs-eyebrow--dark">Foundation</span>
              <h2 id="crs-found-title">Supporting departments</h2>
            </header>
            <div className="crs-found">
              {foundation.map((dept) => {
                const Icon = dept.icon;
                return (
                  <Link key={dept.id} to={`/departments/${dept.id}`} className="crs-found__item">
                    <span className="crs-found__icon"><Icon aria-hidden="true" /></span>
                    <div><h3>{dept.name}</h3><p>{dept.text}</p></div>
                    <FiArrowRight className="crs-found__go" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="crs-block" aria-labelledby="crs-adm-title">
            <header className="crs-head">
              <span className="crs-eyebrow crs-eyebrow--dark">Admission & exams</span>
              <h2 id="crs-adm-title">How it works</h2>
            </header>
            <div className="crs-adm">
              {admission.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label} <FiExternalLink aria-hidden="true" /></a>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="crs-side" aria-labelledby="crs-dl-title">
          <h2 id="crs-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="crs-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="crs-side__label">{item.label}</span>
                  <span className="crs-side__type">{item.type}</span>
                  <FiDownload className="crs-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}