// SkillCourses.jsx - Students > Skill courses (route: /students/skill-courses).
// Page order: hero -> title + "at a glance" card -> programmes -> why skill courses -> "details coming" notice -> related links -> help strip.
// Own hero, own styles (SkillCourses.css, every class starts with "skl-").
// Content comes from the database; the lists below are the fallback and seed.
//
// WHAT IS REAL AND WHAT IS SAMPLE
//   There are no dates or links, so the page shows those two programmes and nothing more about them.
//   REAL      the two programme names; the Apprenticeship text.
//   SAMPLE    the full name "Community Development through Polytechnics" (please confirm it), the CDTP text,
//             the intro sentence, and the whole "Why skill courses" block. Replace them when the college has final wording.
//
// ADDING A PROGRAMME: add ONE object to the `programmes` list below.
//   id       any unique word
//   name     short name shown big on the card
//   full     the full name or a short label
//   icon     an icon from react-icons/fi
//   status   the small label on the card (for example "Details coming soon")
//   text     one or two sentences
//   to       (optional) an internal page to open - the card button then becomes a link to that page
//
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiArrowRight, FiUsers, FiTool, FiBriefcase, FiTrendingUp, FiPhone, FiMail,
  FiInfo,
} from "react-icons/fi";
import PageLoader from "../../components/PageLoader";
import { useStudentPage, mergeStudentContent } from "../../services/studentPageService";
import { mediaUrl } from "../../services/mediaService";
import "./SkillCourses.css";
import { useSite } from "../../context/SiteSettingsContext";

const defaultHero = { image: "/images/campus-3.jpg" }; // wide photo; if it is missing a patterned navy banner shows instead

const defaultIntro = {
  eyebrow: "Students",
  title: "Skill courses",
  lead: "Practical programmes that add skills to your diploma. The institute currently lists two of them: CDTP and Apprenticeship.", // SAMPLE wording
};

const defaultProgrammes = [
  {
    id: "cdtp",
    name: "CDTP",
    full: "Community Development through Polytechnics", // SAMPLE - confirm the full name
    icon: FiUsers,
    status: "Details coming soon",
    text: "A skill programme run by the institute. The course list, duration and dates will be added here as soon as the institute publishes them.", // SAMPLE
  },
  {
    id: "apprenticeship",
    name: "Apprenticeship",
    full: "Training for ITI certificate holders",
    icon: FiTool,
    status: "Full details inside",
    text: "Hands-on training offered every year to ITI certificate holders in trades such as electrical installation, computer operation, plumbing and welding.",
    to: "/students/apprenticeship",
  },
];

// SAMPLE block - general reasons to take a skill programme. Edit freely.
const defaultWhy = [
  { icon: FiTool, title: "Learn by doing", text: "Skill programmes focus on practical work, so you practise what you learn." },
  { icon: FiBriefcase, title: "Build job-ready skills", text: "Add skills that employers look for next to your diploma." },
  { icon: FiTrendingUp, title: "Grow beyond the syllabus", text: "Explore a trade or topic that your regular classes do not cover." },
];

const defaultRelated = [
  { label: "Apprenticeship", text: "Training places for ITI certificate holders.", to: "/students/apprenticeship" },
  { label: "Online learning portals", text: "Free national and board courses to study alongside.", to: "/students/online-learning" },
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

export default function SkillCourses() {
  const { ready, content: savedContent } = useStudentPage("skill-courses");
  const pageContent = resolveStudentMedia(
    mergeStudentContent(
      {
      hero: defaultHero,
      intro: defaultIntro,
      programmes: defaultProgrammes,
      why: defaultWhy,
      related: defaultRelated,
      },
      savedContent
    )
  );
  const hero = pageContent.hero ?? defaultHero;
  const intro = pageContent.intro ?? defaultIntro;
  const programmes = pageContent.programmes ?? defaultProgrammes;
  const why = pageContent.why ?? defaultWhy;
  const related = pageContent.related ?? defaultRelated;

  const { contact } = useSite();
  const programmesReady = programmes.filter((item) => item.to).length;

  if (!ready) return <main id="main" className="skl-page"><PageLoader /></main>;

  return (
    <main id="main" className="skl-page">
      <section className="skl-hero" aria-label="Skill courses" style={{ "--img": `url("${hero.image}")` }}>
        <div className="skl-hero__photo" />
        <div className="skl-hero__tags">
          <span className="skl-hero__tag skl-hero__tag--left">
            <span className="skl-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="skl-hero__tag skl-hero__tag--right">
            <span className="skl-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="skl-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Skill courses</span>
        </nav>
      </section>

      <div className="container skl-wrap">
        {/* ---- title + at a glance ---- */}
        <div className="skl-top">
          <header className="skl-intro">
            <span className="skl-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
            <div className="skl-intro__actions">
              <a className="skl-btn skl-btn--primary" href="#skl-programmes">
                See the programmes
                <FiArrowRight aria-hidden="true" />
              </a>
              <a className="skl-btn skl-btn--line" href="#skl-help">
                Ask the office
              </a>
            </div>
          </header>

          <aside className="skl-glance" aria-label="Skill programmes at a glance">
            <span className="skl-glance__pill"><i aria-hidden="true" /> Skill programmes</span>
            <p className="skl-glance__big">
              <strong>{programmes.length}</strong>
              programmes listed by the institute
            </p>
            <dl>
              <div><dt>{programmesReady}</dt><dd>Page ready</dd></div>
              <div><dt>{programmes.length - programmesReady}</dt><dd>Details coming</dd></div>
            </dl>
          </aside>
        </div>

        {/* ---- programmes ---- */}
        <section id="skl-programmes" className="skl-block" aria-labelledby="skl-prog-title">
          <header className="skl-head">
            <span className="skl-eyebrow skl-eyebrow--line">Programmes</span>
            <h2 id="skl-prog-title">What the institute <span>offers</span></h2>
          </header>
          <ul className="skl-grid">
            {programmes.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <article className="skl-card">
                    <div className="skl-card__top">
                      <span className="skl-card__icon"><Icon aria-hidden="true" /></span>
                      <span className="skl-card__status">{item.status}</span>
                    </div>
                    <h3>{item.name}</h3>
                    <p className="skl-card__full">{item.full}</p>
                    <p className="skl-card__text">{item.text}</p>
                    {item.to ? (
                      <Link className="skl-btn skl-btn--primary skl-card__btn" to={item.to}>
                        Open {item.name}
                        <FiArrowRight aria-hidden="true" />
                      </Link>
                    ) : (
                      <a className="skl-btn skl-btn--line skl-card__btn" href="#skl-help">
                        Ask the office
                        <FiArrowRight aria-hidden="true" />
                      </a>
                    )}
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- why (SAMPLE) ---- */}
        <section className="skl-block" aria-labelledby="skl-why-title">
          <header className="skl-head">
            <span className="skl-eyebrow skl-eyebrow--line">Why it helps</span>
            <h2 id="skl-why-title">Skills that <span>set you apart</span></h2>
          </header>
          <ul className="skl-why">
            {why.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="skl-why__item">
                  <span className="skl-why__no" aria-hidden="true">0{index + 1}</span>
                  <span className="skl-why__icon"><Icon aria-hidden="true" /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- notice ---- */}
        <aside className="skl-notice" aria-label="More details coming">
          <span className="skl-notice__icon"><FiInfo aria-hidden="true" /></span>
          <div>
            <h2>More details are on the way</h2>
            <p>Course names, duration and dates have not been published yet. To ask about a programme today, call or write to the institute office.</p>
          </div>
        </aside>

        {/* ---- related ---- */}
        <section className="skl-related" aria-label="More for students">
          {related.map((item) => (
            <Link key={item.to} className="skl-related__item" to={item.to}>
              <span>
                <strong>{item.label}</strong>
                {item.text}
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>

        {/* ---- help strip ---- */}
        <section id="skl-help" className="skl-help" aria-labelledby="skl-help-title">
          <div>
            <h2 id="skl-help-title">Want to know more about skill programmes?</h2>
            <p>The institute office can tell you what is running and how to join.</p>
          </div>
          <div className="skl-help__actions">
            <a className="skl-btn skl-btn--primary" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
              <FiPhone aria-hidden="true" />
              {contact.phones.join(" / ")}
            </a>
            <a className="skl-btn skl-btn--ghost" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}