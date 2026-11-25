// OnlineLearning.jsx - Students > Online learning portals (route: /students/online-learning).
// Page order: hero -> title + "where do I start" card -> portal cards -> related student links.
// Own hero, own styles (OnlineLearning.css, every class starts with "onl-").
// Content comes from the database; the lists below are the fallback and seed.
//
// ADDING A PORTAL: add ONE object to the `portals` list below.
//   id       any unique word (the "where do I start" card scrolls to it)
//   name     short name shown big on the card
//   full     the full name of the portal
//   host     the web address shown on the card (just for reading)
//   href     the full link - it opens in a new tab
//   icon     an icon from react-icons/fi
//   accent   "sky", "orange" or "mix" - the glow colour of the card
//   text     one or two sentences on what the portal is for
//   topics   up to 4 short words shown as chips
// All three portals are external websites, so the page only introduces them and links out.
import { FiBookOpen, FiMonitor, FiAward, FiArrowUpRight, FiArrowRight, FiHelpCircle, FiZap, FiTarget } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight as FiCrumbArrow } from "react-icons/fi";
import PageLoader from "../../components/PageLoader";
import { useStudentPage, mergeStudentContent } from "../../services/studentPageService";
import { mediaUrl } from "../../services/mediaService";
import "./OnlineLearning.css";
import { useSite } from "../../context/SiteSettingsContext";

const defaultHero = { image: "/images/pages-banner.png" }; // wide photo; if it is missing a patterned navy banner shows instead

const defaultIntro = {
  eyebrow: "Students",
  title: "Online learning portals",
  lead: "National and board portals with books, lectures and courses you can use alongside your classes. Each one opens in a new tab.",
};

const defaultPortals = [
  {
    id: "ndli",
    name: "NDLI",
    full: "National Digital Library of India",
    host: "ndl.iitkgp.ac.in",
    href: "https://ndl.iitkgp.ac.in/",
    icon: FiBookOpen,
    accent: "sky",
    text: "A single-window digital library of books, articles and lectures from many institutions, developed by IIT Kharagpur for the Ministry of Education.",
    topics: ["Books", "Articles", "Lectures"],
  },
  {
    id: "swayam",
    name: "SWAYAM",
    full: "Study Webs of Active-Learning for Young Aspiring Minds",
    host: "swayam.gov.in",
    href: "https://swayam.gov.in/",
    icon: FiMonitor,
    accent: "orange",
    text: "India's national platform for online courses, with video lectures and assessments on a wide range of subjects.",
    topics: ["Online courses", "Video lectures", "Assessments"],
  },
  {
    id: "hsbte",
    name: "HSBTE e-learning",
    full: "Haryana State Board of Technical Education",
    host: "",
    href: "",
    icon: FiAward,
    accent: "mix",
    text: "The digital learning section of the board that conducts your diploma examinations.",
    topics: ["Diploma e-learning", "Board resources"],
  },
];

// The "where do I start" card - each line points at one portal above.
const defaultGuide = [
  { goal: "Prepare for your diploma exams", to: "hsbte", name: "HSBTE e-learning", icon: FiTarget },
  { goal: "Learn a new subject or skill", to: "swayam", name: "SWAYAM", icon: FiZap },
  { goal: "Read books, articles and lectures", to: "ndli", name: "NDLI", icon: FiBookOpen },
];

const defaultRelated = [
  { label: "Skill courses", text: "Short courses to build job-ready skills.", to: "/students/skill-courses" },
  { label: "Student helpline", text: "Stuck with a login or a course? Ask for help.", to: "/students/helpline" },
];

// Saved paths that start with /uploads/ become full backend addresses; everything else is left as it is.
function resolveStudentMedia(value) {
  if (Array.isArray(value)) return value.map(resolveStudentMedia);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveStudentMedia(item)]));
  }
  if (typeof value === "string" && value.startsWith("/uploads/")) return mediaUrl(value);
  return value;
}

export default function OnlineLearning() {
  const { ready, content: savedContent } = useStudentPage("online-learning");
  const pageContent = resolveStudentMedia(
    mergeStudentContent(
      {
      hero: defaultHero,
      intro: defaultIntro,
      portals: defaultPortals,
      guide: defaultGuide,
      related: defaultRelated,
      },
      savedContent
    )
  );
  const hero = pageContent.hero ?? defaultHero;
  const intro = pageContent.intro ?? defaultIntro;
  const portals = pageContent.portals ?? defaultPortals;
  const guide = pageContent.guide ?? defaultGuide;
  const related = pageContent.related ?? defaultRelated;

  const { links } = useSite();
  const hsbte = portals.find((portal) => portal.id === "hsbte");
  if (hsbte) {
    hsbte.href = links?.hsbte ? `${links.hsbte.replace(/\/$/, "")}/digital-elearning` : "";
    hsbte.host = hsbte.href ? hsbte.href.replace(/^https?:\/\//, "") : "";
  }
  if (!ready) return <main id="main" className="onl-page"><PageLoader /></main>;

  return (
    <main id="main" className="onl-page">
      <section className="onl-hero" aria-label="Online learning portals" style={{ "--img": `url("${hero.image}")` }}>
        <div className="onl-hero__photo" />
        <div className="onl-hero__tags">
          <span className="onl-hero__tag onl-hero__tag--left">
            <span className="onl-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="onl-hero__tag onl-hero__tag--right">
            <span className="onl-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="onl-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Online learning portals</span>
        </nav>
      </section>

      <div className="container onl-wrap">
        {/* ---- title + "where do I start" card ---- */}
        <div className="onl-top">
          <header className="onl-intro">
            <span className="onl-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <aside className="onl-guide" aria-labelledby="onl-guide-title">
            <h2 id="onl-guide-title"><FiHelpCircle aria-hidden="true" /> Where do I start?</h2>
            <ul>
              {guide.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <a href={`#onl-${item.to}`}>
                      <span className="onl-guide__icon"><Icon aria-hidden="true" /></span>
                      <span className="onl-guide__text">
                        {item.goal}
                        <strong>{item.name}</strong>
                      </span>
                      <FiArrowRight className="onl-guide__go" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        {/* ---- portal cards ---- */}
        <section aria-labelledby="onl-portals-title">
          <header className="onl-head">
            <span className="onl-eyebrow onl-eyebrow--line">Official portals</span>
            <h2 id="onl-portals-title">Learn <span>beyond the classroom</span></h2>
          </header>

          <ul className="onl-grid">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <li key={portal.id} id={`onl-${portal.id}`}>
                  <article className={`onl-card onl-card--${portal.accent}`}>
                    <Icon className="onl-card__ghost" aria-hidden="true" />
                    <span className="onl-card__icon"><Icon aria-hidden="true" /></span>

                    <div className="onl-card__body">
                      <span className="onl-card__host">{portal.host}</span>
                      <h3>{portal.name}</h3>
                      <p className="onl-card__full">{portal.full}</p>
                      <p>{portal.text}</p>
                      {portal.topics?.length > 0 && (
                        <ul className="onl-card__topics" aria-label={`What you will find on ${portal.name}`}>
                          {portal.topics.map((topic) => (
                            <li key={topic}>{topic}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <a className="onl-btn" href={portal.href} target="_blank" rel="noopener noreferrer">
                      Open {portal.name}
                      <FiArrowUpRight aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- related student pages ---- */}
        <section className="onl-related" aria-label="More for students">
          {related.map((item) => (
            <Link key={item.to} className="onl-related__item" to={item.to}>
              <span>
                <strong>{item.label}</strong>
                {item.text}
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}