// Freelancing.jsx - Students > Freelancing (route: /students/freelancing).
// Page order: hero -> title + "where do I start" card -> what freelancing means -> get ready in 3 steps -> notice -> related -> help strip.
// Own hero, own styles (Freelancing.css, every class starts with "frl-").
// Content comes from the database; the lists below are the fallback and seed.
//
// WHAT IS REAL AND WHAT IS SAMPLE
//   This page stays honest: it explains freelancing in general and points students to pages that already exist.
//   REAL      the links, the contact details, and the fact that details are still being prepared.
//   SAMPLE    every sentence about what freelancing is and the 3 "get ready" steps. They are general guidance, not
//             institute claims. When the college has a freelancing programme, replace the `meaning` and `steps` lists
//             (and delete the notice).
//
// EDITING: `meaning` and `steps` are plain lists - each object has an icon, a title and a text.
//
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiArrowRight, FiHelpCircle, FiZap, FiMonitor, FiMessageCircle, FiClock,
  FiBriefcase, FiAward, FiTarget, FiFolder, FiSend, FiPhone, FiMail, FiInfo,
} from "react-icons/fi";
import PageLoader from "../../components/PageLoader";
import { useStudentPage, mergeStudentContent } from "../../services/studentPageService";
import { mediaUrl } from "../../services/mediaService";
import "./Freelancing.css";
import { useSite } from "../../context/SiteSettingsContext";

const defaultHero = { image: "/images/pages-banner.png" }; // wide photo; if it is missing a patterned navy banner shows instead

const defaultIntro = {
  eyebrow: "Students",
  title: "Freelancing",
};

// The navy "where do I start" card. Each line opens a page that already exists on this site.
const defaultGuide = [
  { goal: "Learn a practical skill", name: "Skill courses", to: "/students/skill-courses", icon: FiZap },
  { goal: "Study online, free of cost", name: "Online learning portals", to: "/students/online-learning", icon: FiMonitor },
  { goal: "Ask a question", name: "Student helpline", to: "/students/helpline", icon: FiMessageCircle },
];

// SAMPLE - what freelancing means, in general.
const defaultMeaning = [
  { icon: FiClock, title: "Work on your own terms", text: "A freelancer is not tied to one employer. You choose when and how you work." },
  { icon: FiBriefcase, title: "Take on projects", text: "You do a piece of work for a client, deliver it, and then move to the next one." },
  { icon: FiAward, title: "Earn from your skills", text: "The better your skill, the more work you can offer, so a diploma skill can become a source of income." },
];

// SAMPLE - three simple steps for a student who wants to try.
const defaultSteps = [
  { icon: FiTarget, title: "Pick one skill", text: "Choose a single skill you enjoy, such as drafting, programming, electrical work or repair, and get good at it." },
  { icon: FiFolder, title: "Build a small portfolio", text: "Keep photos, files or links of your best work in one place, so a client can see what you can do." },
  { icon: FiSend, title: "Start with a small project", text: "Offer your skill to someone you know. A small first job teaches more than any plan." },
];

const defaultRelated = [
  { label: "Skill courses", text: "Practical programmes to build your skills.", to: "/students/skill-courses" },
  { label: "Incubator", text: "Taking an idea further than a single project.", to: "/students/incubator" },
  { label: "Entrepreneurship", text: "Stories and support for student entrepreneurs.", to: "/about/entrepreneurship" },
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

export default function Freelancing() {
  const { ready, content: savedContent } = useStudentPage("freelancing");
  const pageContent = resolveStudentMedia(
    mergeStudentContent(
      {
      hero: defaultHero,
      intro: defaultIntro,
      guide: defaultGuide,
      meaning: defaultMeaning,
      steps: defaultSteps,
      related: defaultRelated,
      },
      savedContent
    )
  );
  const hero = pageContent.hero ?? defaultHero;
  const intro = pageContent.intro ?? defaultIntro;
  const guide = pageContent.guide ?? defaultGuide;
  const meaning = pageContent.meaning ?? defaultMeaning;
  const steps = pageContent.steps ?? defaultSteps;
  const related = pageContent.related ?? defaultRelated;

  const { contact } = useSite();
  if (!ready) return <main id="main" className="frl-page"><PageLoader /></main>;

  return (
    <main id="main" className="frl-page">
      <section className="frl-hero" aria-label="Freelancing" style={{ "--img": `url("${hero.image}")` }}>
        <div className="frl-hero__photo" />
        <div className="frl-hero__tags">
          <span className="frl-hero__tag frl-hero__tag--left">
            <span className="frl-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="frl-hero__tag frl-hero__tag--right">
            <span className="frl-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="frl-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Freelancing</span>
        </nav>
      </section>

      <div className="container frl-wrap">
        {/* ---- title + where do I start ---- */}
        <div className="frl-top">
          <div className="frl-intro">
            <header>
              <span className="frl-eyebrow">{intro.eyebrow}</span>
              <h1>{intro.title}</h1>
              <p>{intro.lead}</p>
            </header>

            <section className="frl-quick" aria-labelledby="frl-mean-title">
              <header className="frl-head">
                <span className="frl-eyebrow frl-eyebrow--line">The idea</span>
                <h2 id="frl-mean-title">What freelancing <span>means</span></h2>
              </header>
              <ul className="frl-cards frl-cards--compact">
                {meaning.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.title} className="frl-card">
                      <span className="frl-card__icon"><Icon aria-hidden="true" /></span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          <aside className="frl-guide" aria-labelledby="frl-guide-title">
            <span className="frl-guide__pill"><i aria-hidden="true" /> Details being prepared</span>
            <h2 id="frl-guide-title"><FiHelpCircle aria-hidden="true" /> Where do I start?</h2>
            <ul>
              {guide.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link to={item.to}>
                      <span className="frl-guide__icon"><Icon aria-hidden="true" /></span>
                      <span className="frl-guide__text">
                        {item.goal}
                        <strong>{item.name}</strong>
                      </span>
                      <FiArrowRight className="frl-guide__go" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        {/* ---- three steps (SAMPLE) ---- */}
        <section className="frl-block" aria-labelledby="frl-steps-title">
          <header className="frl-head">
            <span className="frl-eyebrow frl-eyebrow--line">Get ready</span>
            <h2 id="frl-steps-title">Start in <span>3 steps</span></h2>
          </header>
          <ol className="frl-steps">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="frl-step">
                  <span className="frl-step__no" aria-hidden="true">{index + 1}</span>
                  <span className="frl-step__icon"><Icon aria-hidden="true" /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ---- notice ---- */}
        <aside className="frl-notice" aria-label="Institute details coming">
          <span className="frl-notice__icon"><FiInfo aria-hidden="true" /></span>
          <div>
            <h2>The institute&apos;s freelancing details are being prepared</h2>
            <p>This page will be updated as soon as they are ready. For any question in the meantime, call or write to the institute office.</p>
          </div>
        </aside>

        {/* ---- related ---- */}
        <section className="frl-related" aria-label="More for students">
          {related.map((item) => (
            <Link key={item.to} className="frl-related__item" to={item.to}>
              <span>
                <strong>{item.label}</strong>
                {item.text}
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>

        {/* ---- help strip ---- */}
        <section className="frl-help" aria-labelledby="frl-help-title">
          <div>
            <h2 id="frl-help-title">Questions about freelancing?</h2>
            <p>The institute office will point you in the right direction.</p>
          </div>
          <div className="frl-help__actions">
            <a className="frl-btn frl-btn--primary" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
              <FiPhone aria-hidden="true" />
              {contact.phones.join(" / ")}
            </a>
            <a className="frl-btn frl-btn--ghost" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}