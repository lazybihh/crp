// Placements.jsx - About us > Placements (route: /about/placements).
// This page has its own hero, its own styles (placements.css, every class starts with "plc-") and its own downloads sidebar.
// Recruiters and campus activity come from the Home page.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight, FiFileText, FiDownload, FiBriefcase, FiMonitor, FiUsers, FiGlobe, FiLayers, FiCalendar,
  FiUser,
} from "react-icons/fi";
import "./Placements.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const img = (file) => `/images/${file}`;

const defaultHero = { image: "/images/campus-2.jpg" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Placements",
  lead: "A placement cell that works all year - from industrial training to the final interview.",
};

const defaultOfficer = { name: "Mr. Jai Kanwar", role: "Training & Placement Officer" };

const defaultSupport = [
  { icon: FiBriefcase, title: "Training & Placement Office", text: "A separate, fully furnished, air-conditioned office for the placement cell." },
  { icon: FiUsers, title: "Mini-auditorium", text: "An air-conditioned mini-auditorium for pre-placement talks." },
  { icon: FiMonitor, title: "Smart classrooms", text: "Used for recruitment tests and interviews." },
  { icon: FiGlobe, title: "Japanese language course", text: "A free fundamental course to help students get placed in Japanese-oriented companies." },
  { icon: FiLayers, title: "Industrial training", text: "Mandatory for students, with government organisations preferred." },
  { icon: FiCalendar, title: "Industry-Institute Cell", text: "Expert lectures, workshops at institute and state levels, and seminars." },
];

const defaultSteps = [
  "Companies are invited by email and fix a test or interview date",
  "Pre-placement talk (PPT)",
  "Pre-placement assessment: technical test, group discussion, psychomotor test or interview",
  "Screening and shortlisting for the final interview",
  "Technical interview, followed by an HR interview",
  "Offer letter with pay, package, fringe benefits and terms",
];

const defaultRecruiters = [
  { name: "HCL", logo: img("recruiter-hcl.jpg") },
  { name: "Jindal Steel & Power", logo: img("recruiter-jindal-steel-power.jpg") },
  { name: "Tata Motors", logo: img("recruiter-tata-motors.jpg") },
  { name: "Tech Mahindra", logo: img("recruiter-tech-mahindra.jpg") },
];

const defaultActivity = [
  { date: "23 Feb 2026", text: "Campus drive by VVDN Technologies, Manesar, in the Conference Hall" },
  { date: "2026", text: "Industrial visits for 3rd and 5th semester students" },
];

// Visit reports go in public/docs. The 2022-23 folder stays on Google Drive.
const downloads = [
  { label: "Industrial visit folder, 2022-23", href: "https://drive.google.com/drive/folders/1xmq6M__BRi5x5Bzuull4-o5ALdUJ3zVm?usp=sharing", type: "Drive" },
  { label: "Industrial visit, 5th sem Mechanical", href: "/docs/industrial-visit-5th-sem-mechanical.pdf", type: "PDF" },
  { label: "Industrial visit, 3rd sem Mechanical", href: "/docs/industrial-visit-3rd-sem-mechanical.pdf", type: "PDF" },
  { label: "Industrial visit, 5th sem Electrical", href: "/docs/industrial-visit-5th-sem-electrical.pdf", type: "PDF" },
];

export default function Placements() {
  const { ready, content: savedContent } = useAboutPage("placements");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const officer = mergeAboutContent(defaultOfficer, savedContent?.officer);
  const support = mergeAboutContent(defaultSupport, savedContent?.support);
  const steps = mergeAboutContent(defaultSteps, savedContent?.steps);
  const recruiters = mergeAboutContent(defaultRecruiters, savedContent?.recruiters);
  const activity = mergeAboutContent(defaultActivity, savedContent?.activity);

  if (!ready) return <main id="main" className="plc-page"><PageLoader /></main>;

  return (
    <main id="main" className="plc-page">
      {/* ---- hero ---- */}
      <section className="plc-hero" aria-label="Placements" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="plc-hero__photo" />
        <div className="plc-hero__tags">
          <span className="plc-hero__tag plc-hero__tag--left">
            <span className="plc-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="plc-hero__tag plc-hero__tag--right">
            <span className="plc-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="plc-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Placements</span>
        </nav>
      </section>

      <div className="container plc-layout">
        <div className="plc-content">
          {/* ---- title (level with the downloads card) ---- */}
          <header className="plc-intro">
            <span className="plc-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <div className="plc-officer">
            <span className="plc-officer__icon"><FiUser aria-hidden="true" /></span>
            <div>
              <span className="plc-officer__label">Contact person</span>
              <strong>{officer.name}</strong>
              <span>{officer.role}</span>
            </div>
          </div>

          <section className="plc-block" aria-labelledby="plc-support-title">
            <header className="plc-head">
              <span className="plc-eyebrow plc-eyebrow--dark">The placement cell</span>
              <h2 id="plc-support-title">What supports every student</h2>
            </header>
            <div className="plc-support">
              {support.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title}>
                    <span className="plc-support__icon"><Icon aria-hidden="true" /></span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="plc-block" aria-labelledby="plc-process-title">
            <header className="plc-head">
              <span className="plc-eyebrow plc-eyebrow--dark">Recruitment process</span>
              <h2 id="plc-process-title">How a campus drive works</h2>
            </header>
            <ol className="plc-steps">
              {steps.map((step, index) => (
                <li key={step}>
                  <span className="plc-steps__no">{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="plc-block" aria-labelledby="plc-rec-title">
            <header className="plc-head">
              <span className="plc-eyebrow plc-eyebrow--dark">Our recruiters</span>
              <h2 id="plc-rec-title">Companies that hire from us</h2>
            </header>
            <ul className="plc-recruiters">
              {recruiters.map((company) => (
                <li key={company.name}>
                  <img src={mediaUrl(company.logo)} alt={company.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  <span>{company.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="plc-block" aria-labelledby="plc-act-title">
            <header className="plc-head">
              <span className="plc-eyebrow plc-eyebrow--dark">Recent activity</span>
              <h2 id="plc-act-title">On campus lately</h2>
            </header>
            <ul className="plc-activity">
              {activity.map((item) => (
                <li key={item.text}><time>{item.date}</time><span>{item.text}</span></li>
              ))}
            </ul>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="plc-side" aria-labelledby="plc-dl-title">
          <h2 id="plc-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="plc-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="plc-side__label">{item.label}</span>
                  <span className="plc-side__type">{item.type}</span>
                  <FiDownload className="plc-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
