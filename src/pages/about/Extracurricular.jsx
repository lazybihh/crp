// Extracurricular.jsx - About us > Extracurricular achievements (route: /about/extracurricular).
// This page has its own hero, its own styles (Extracurricular.css, every class starts with "ext-") and its own downloads sidebar.
// The content below comes from the Home page
// (NCC since 1949, the sports list, achievements and upcoming events). Add the PDF's details here when you have them.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload, FiFlag, FiActivity, FiMusic, FiAward, FiCalendar } from "react-icons/fi";
import "./Extracurricular.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const defaultHero = { image: "/images/campus-workshop.jpg" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Extracurricular achievements",
  lead: "NCC, sports and culture - the activities that build confidence, teamwork and character alongside the diploma.",
};

const defaultNcc = {
  since: "1949",
  title: "National Cadet Corps",
  text: "The institute's NCC unit was instituted in 1949. Cadets take part in camps, parades and service activities that build discipline and leadership.",
};

const defaultSports = ["Volleyball", "Football", "Basketball", "Badminton", "Kho kho"];

const defaultCulture = {
  title: "Culture and campus life",
  text: "Cultural events run through the year, and the annual cultural fest brings every department on stage together.", // SAMPLE wording around the real Home items
};

// From the Home page "Achievements" panel.
const defaultAchievements = [
  { date: "2026", text: "NCC cadets selected for state camp" },
  { date: "2026", text: "Students win inter-polytechnic sports meet" },
  { date: "2025", text: "Project showcase recognised by industry guests" },
];

// From the Home page "Upcoming events" panel.
const defaultUpcoming = [
  { date: "Dec 2026", text: "Annual technical exhibition" },
  { date: "Jan 2027", text: "Republic Day parade and NCC display" },
  { date: "Feb 2027", text: "Cultural fest" },
];

// Put the real files in public/docs. The first one is the PDF the old Extracurricular page linked to.
const downloads = [
  { label: "Extracurricular activities", href: "/docs/extracurricular-activities.pdf", type: "PDF" },
  { label: "About NCC", href: "/docs/about-ncc.pdf", type: "PDF" },
  { label: "How to join NCC", href: "/docs/how-to-join-ncc.pdf", type: "PDF" },
  { label: "Eligibility for certificate examination", href: "/docs/eligibility-certificate-examination.pdf", type: "PDF" },
  { label: "Incentives to cadets", href: "/docs/incentives-to-cadets.pdf", type: "PDF" },
];

export default function Extracurricular() {
  const { ready, content: savedContent } = useAboutPage("extracurricular");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const ncc = mergeAboutContent(defaultNcc, savedContent?.ncc);
  const sports = mergeAboutContent(defaultSports, savedContent?.sports);
  const culture = mergeAboutContent(defaultCulture, savedContent?.culture);
  const achievements = mergeAboutContent(defaultAchievements, savedContent?.achievements);
  const upcoming = mergeAboutContent(defaultUpcoming, savedContent?.upcoming);

  if (!ready) return <main id="main" className="ext-page"><PageLoader /></main>;

  return (
    <main id="main" className="ext-page">
      {/* ---- hero ---- */}
      <section className="ext-hero" aria-label="Extracurricular achievements" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="ext-hero__photo" />
        <div className="ext-hero__tags">
          <span className="ext-hero__tag ext-hero__tag--left">
            <span className="ext-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="ext-hero__tag ext-hero__tag--right">
            <span className="ext-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="ext-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Extracurricular</span>
        </nav>
      </section>

      <div className="container ext-layout">
        <div className="ext-content">
          {/* ---- title (level with the downloads card) ---- */}
          <header className="ext-intro">
            <span className="ext-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <section className="ext-ncc" aria-labelledby="ext-ncc-title">
            <div className="ext-ncc__year" aria-hidden="true">
              <span>Since</span>
              <strong>{ncc.since}</strong>
            </div>
            <div>
              <span className="ext-eyebrow ext-eyebrow--light"><FiFlag aria-hidden="true" /> NCC</span>
              <h2 id="ext-ncc-title">{ncc.title}</h2>
              <p>{ncc.text}</p>
            </div>
          </section>

          <div className="ext-pair">
            <section className="ext-sports" aria-labelledby="ext-sports-title">
              <span className="ext-pair__icon"><FiActivity aria-hidden="true" /></span>
              <h2 id="ext-sports-title">Sports</h2>
              <ul>
                {sports.map((sport) => <li key={sport}>{sport}</li>)}
              </ul>
            </section>
            <section className="ext-culture" aria-labelledby="ext-culture-title">
              <span className="ext-pair__icon"><FiMusic aria-hidden="true" /></span>
              <h2 id="ext-culture-title">{culture.title}</h2>
              <p>{culture.text}</p>
            </section>
          </div>

          <section className="ext-block" aria-labelledby="ext-ach-title">
            <header className="ext-head">
              <span className="ext-eyebrow ext-eyebrow--dark">Recent achievements</span>
              <h2 id="ext-ach-title">What our students have won</h2>
            </header>
            <ul className="ext-list">
              {achievements.map((item) => (
                <li key={item.text}>
                  <span className="ext-list__icon"><FiAward aria-hidden="true" /></span>
                  <div><time>{item.date}</time><p>{item.text}</p></div>
                </li>
              ))}
            </ul>
          </section>

          <section className="ext-block" aria-labelledby="ext-up-title">
            <header className="ext-head">
              <span className="ext-eyebrow ext-eyebrow--dark">Coming up</span>
              <h2 id="ext-up-title">Upcoming events</h2>
            </header>
            <ol className="ext-upcoming">
              {upcoming.map((item) => (
                <li key={item.text}>
                  <span className="ext-upcoming__date"><FiCalendar aria-hidden="true" />{item.date}</span>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="ext-side" aria-labelledby="ext-dl-title">
          <h2 id="ext-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="ext-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="ext-side__label">{item.label}</span>
                  <span className="ext-side__type">{item.type}</span>
                  <FiDownload className="ext-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
