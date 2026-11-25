// Projects.jsx - About us > Projects (route: /about/projects).
// This page has its own hero, its own styles (Projects.css, every class starts with "prj-") and its own downloads sidebar.
// Everything marked SAMPLE is placeholder text - confirm or replace it from the admin.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload, FiUsers, FiCpu, FiTool, FiBox, FiAward, FiCalendar } from "react-icons/fi";
import "./Projects.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const defaultHero = { image: "/images/pages-banner.png" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Projects",
  lead: "Where classroom learning turns into things that work - for the campus and for the community.",
};

// SAMPLE: confirm the full name of CDTP and the work done under it, then edit this block.
const defaultCdtp = {
  short: "CDTP",
  name: "Community Development through Polytechnics",
  text: "Under CDTP the institute takes its skills to the people around it, with training and technology support for the local community.",
  points: ["Skill training for the community", "Technology and awareness support", "Students working with real needs"],
};

// SAMPLE: replace with real student projects (title, department, one line).
const defaultProjects = [
  { icon: FiBox, tag: "Civil Engineering", title: "Sample project title", text: "A short line about what the students built or studied and what it achieved." },
  { icon: FiCpu, tag: "Computer Engineering", title: "Sample project title", text: "A short line about what the students built or studied and what it achieved." },
  { icon: FiTool, tag: "Mechanical Engineering", title: "Sample project title", text: "A short line about what the students built or studied and what it achieved." },
];

// Same items as on the Home page.
const defaultShowcase = [
  { icon: FiAward, date: "2025", text: "Project showcase recognised by industry guests" },
  { icon: FiCalendar, date: "Dec 2026", text: "Annual technical exhibition" },
];

const downloads = [
  { label: "Annual Report, 2024", href: "/docs/annual-report-2024.pdf", type: "PDF" },
];

export default function Projects() {
  const { ready, content: savedContent } = useAboutPage("projects");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const cdtp = mergeAboutContent(defaultCdtp, savedContent?.cdtp);
  const projects = mergeAboutContent(defaultProjects, savedContent?.projects);
  const showcase = mergeAboutContent(defaultShowcase, savedContent?.showcase);

  if (!ready) return <main id="main" className="prj-page"><PageLoader /></main>;

  return (
    <main id="main" className="prj-page">
      {/* ---- hero ---- */}
      <section className="prj-hero" aria-label="Projects" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="prj-hero__photo" />
        <div className="prj-hero__tags">
          <span className="prj-hero__tag prj-hero__tag--left">
            <span className="prj-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="prj-hero__tag prj-hero__tag--right">
            <span className="prj-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="prj-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Projects</span>
        </nav>
      </section>

      <div className="container prj-layout">
        <div className="prj-content">
          {/* ---- title (level with the downloads card) ---- */}
          <header className="prj-intro">
            <span className="prj-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <section className="prj-spotlight" aria-labelledby="prj-cdtp-title">
            <div className="prj-spotlight__badge" aria-hidden="true">{cdtp.short}</div>
            <div>
              <span className="prj-eyebrow prj-eyebrow--light">Institute project</span>
              <h2 id="prj-cdtp-title">{cdtp.name}</h2>
              <p>{cdtp.text}</p>
              <ul>
                {cdtp.points.map((point) => <li key={point}><FiUsers aria-hidden="true" />{point}</li>)}
              </ul>
            </div>
          </section>

          <section className="prj-block" aria-labelledby="prj-student-title">
            <header className="prj-head">
              <span className="prj-eyebrow prj-eyebrow--dark">Student projects</span>
              <h2 id="prj-student-title">Built by our students</h2>
            </header>
            <div className="prj-cards">
              {projects.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={index}>
                    <span className="prj-cards__icon"><Icon aria-hidden="true" /></span>
                    <span className="prj-cards__tag">{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="prj-block" aria-labelledby="prj-show-title">
            <header className="prj-head">
              <span className="prj-eyebrow prj-eyebrow--dark">Showcase</span>
              <h2 id="prj-show-title">Seen by industry</h2>
            </header>
            <ul className="prj-showcase">
              {showcase.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.text}>
                    <span className="prj-showcase__icon"><Icon aria-hidden="true" /></span>
                    <div><time>{item.date}</time><p>{item.text}</p></div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="prj-side" aria-labelledby="prj-dl-title">
          <h2 id="prj-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="prj-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="prj-side__label">{item.label}</span>
                  <span className="prj-side__type">{item.type}</span>
                  <FiDownload className="prj-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
