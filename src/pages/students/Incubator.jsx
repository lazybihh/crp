// Incubator.jsx - Students > Incubator (route: /students/incubator).
// Page order: hero -> title + "idea to launch" card -> what incubators usually offer -> notice -> related -> help strip.
// Own hero, own styles (Incubator.css, every class starts with "inc-").
// Content comes from the database; the lists below are the fallback and seed.
//
// WHAT IS REAL AND WHAT IS SAMPLE
//   This page explains what an incubator is in general and says plainly that the institute's details are being prepared.
//   REAL      the links, the contact details, and the fact that details are still being prepared.
//   SAMPLE    the "idea to launch" journey and the four "what incubators usually offer" cards. They are general
//             descriptions of incubators everywhere - NOT claims about this institute. When the college has an incubator,
//             replace the `journey` and `offers` lists (and delete the notice).
//
// EDITING: `journey` and `offers` are plain lists - each object has an icon, a title and a text.
//
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiArrowRight, FiSun, FiEdit3, FiTool, FiSend, FiUsers, FiHome, FiShare2,
  FiCompass, FiPhone, FiMail, FiInfo,
} from "react-icons/fi";
import PageLoader from "../../components/PageLoader";
import { useStudentPage, mergeStudentContent } from "../../services/studentPageService";
import { mediaUrl } from "../../services/mediaService";
import "./Incubator.css";
import { useSite } from "../../context/SiteSettingsContext";

const defaultHero = { image: "/images/campus-workshop.jpg" }; // wide photo; if it is missing a patterned navy banner shows instead

const defaultIntro = {
  eyebrow: "Students",
  title: "Incubator",
  lead: "A place where a student idea can grow into something real. The institute is preparing its incubator details - this page shows what an incubator is and where to begin.",
};

// SAMPLE - the four stages of a startup idea, in general.
const defaultJourney = [
  { icon: FiSun, title: "Idea", text: "Spot a problem worth solving." },
  { icon: FiEdit3, title: "Plan", text: "Decide who it is for and how it works." },
  { icon: FiTool, title: "Build", text: "Make a first working version." },
  { icon: FiSend, title: "Launch", text: "Put it in front of real users." },
];

// SAMPLE - what incubators usually give a young team. Not a list of what THIS institute gives.
const defaultOffers = [
  { icon: FiUsers, title: "Mentoring", text: "Guidance from people who have built things before." },
  { icon: FiHome, title: "Workspace", text: "A place to meet, plan and build with your team." },
  { icon: FiShare2, title: "Networking", text: "Introductions to experts, other founders and possible customers." },
  { icon: FiCompass, title: "Direction", text: "Help with the next step, from a first prototype to a first customer." },
];

const defaultRelated = [
  { label: "Entrepreneurship", text: "Stories and support for student entrepreneurs.", to: "/about/entrepreneurship" },
  { label: "Student projects", text: "See what students at the institute have built.", to: "/about/projects" },
  { label: "Freelancing", text: "Turn a skill into projects of your own.", to: "/students/freelancing" },
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

export default function Incubator() {
  const { ready, content: savedContent } = useStudentPage("incubator");
  const pageContent = resolveStudentMedia(
    mergeStudentContent(
      {
      hero: defaultHero,
      intro: defaultIntro,
      journey: defaultJourney,
      offers: defaultOffers,
      related: defaultRelated,
      },
      savedContent
    )
  );
  const hero = pageContent.hero ?? defaultHero;
  const intro = pageContent.intro ?? defaultIntro;
  const journey = pageContent.journey ?? defaultJourney;
  const offers = pageContent.offers ?? defaultOffers;
  const related = pageContent.related ?? defaultRelated;

  const { contact } = useSite();
  if (!ready) return <main id="main" className="inc-page"><PageLoader /></main>;

  return (
    <main id="main" className="inc-page">
      <section className="inc-hero" aria-label="Incubator" style={{ "--img": `url("${hero.image}")` }}>
        <div className="inc-hero__photo" />
        <div className="inc-hero__tags">
          <span className="inc-hero__tag inc-hero__tag--left">
            <span className="inc-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="inc-hero__tag inc-hero__tag--right">
            <span className="inc-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="inc-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Incubator</span>
        </nav>
      </section>

      <div className="container inc-wrap">
        {/* ---- title + idea-to-launch card ---- */}
        <div className="inc-top">
          <header className="inc-intro">
            <span className="inc-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <aside className="inc-journey" aria-labelledby="inc-journey-title">
            <span className="inc-journey__pill"><i aria-hidden="true" /> Details being prepared</span>
            <h2 id="inc-journey-title">From idea to launch</h2>
            <ol>
              {journey.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.title}>
                    <span className="inc-journey__icon"><Icon aria-hidden="true" /></span>
                    <span className="inc-journey__text">
                      <strong>{item.title}</strong>
                      {item.text}
                    </span>
                    <span className="inc-journey__no" aria-hidden="true">0{index + 1}</span>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>

        {/* ---- what incubators usually offer (SAMPLE) ---- */}
        <section className="inc-block" aria-labelledby="inc-offer-title">
          <header className="inc-head">
            <span className="inc-eyebrow inc-eyebrow--line">The idea</span>
            <h2 id="inc-offer-title">What incubators <span>usually offer</span></h2>
          </header>
          <ul className="inc-grid">
            {offers.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="inc-card">
                  <span className="inc-card__icon"><Icon aria-hidden="true" /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- notice ---- */}
        <aside className="inc-notice" aria-label="Institute details coming">
          <span className="inc-notice__icon"><FiInfo aria-hidden="true" /></span>
          <div>
            <h2>The institute&apos;s incubator details are being prepared</h2>
            <p>What is offered here, who can apply and how will be added to this page soon. Until then, call or write to the institute office with your idea.</p>
          </div>
        </aside>

        {/* ---- related ---- */}
        <section className="inc-related" aria-label="More for students">
          {related.map((item) => (
            <Link key={item.to} className="inc-related__item" to={item.to}>
              <span>
                <strong>{item.label}</strong>
                {item.text}
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>

        {/* ---- help strip ---- */}
        <section className="inc-help" aria-labelledby="inc-help-title">
          <div>
            <h2 id="inc-help-title">Have an idea you want to grow?</h2>
            <p>Tell the institute office about it and ask what support is available.</p>
          </div>
          <div className="inc-help__actions">
            <a className="inc-btn inc-btn--primary" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
              <FiPhone aria-hidden="true" />
              {contact.phones.join(" / ")}
            </a>
            <a className="inc-btn inc-btn--ghost" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}