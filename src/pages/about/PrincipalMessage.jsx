// PrincipalMessage.jsx - About us > Principal's desk (route: /about/principal-message).
// This page has its own hero, its own styles (principal-message.css, every class starts with "pm-") and its own downloads sidebar.
// Everything in the message is SAMPLE text - replace it with the Principal's real message from the admin.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload, FiTool, FiBriefcase, FiUsers } from "react-icons/fi";
import "./Principal-message.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const img = (file) => `/images/${file}`;

const defaultHero = { image: "/images/campus-3.jpg" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Principal's desk",
  lead: "A few words to students, parents and everyone who believes in technical education.",
};

const defaultPrincipal = {
  name: "Dr. Sitender Kumar",
  role: "Principal, Chhotu Ram Polytechnic",
  photo: img("principal.png"),
  quote: "We do not only teach a trade - we help young people become confident, employable engineers.",
  paragraphs: [
    "Chhotu Ram Polytechnic began with two-year draftsman courses and has grown into one of the leading technical institutes in the region. Our strength is the link between classroom, workshop and industry.",
    "Every student here gets practical training, industrial exposure and a placement cell that works all year. Our teachers guide each batch with patience, and our alumni are the best proof that the approach works.",
    "To every student joining us: work with your hands, ask questions and use the campus fully. To every parent: your trust is the reason we keep raising the bar. I invite you to visit the campus and see it for yourself.",
  ],
};

const defaultPillars = [
  { icon: FiTool, title: "Practical training", text: "Workshops and laboratories make every concept something students can build and test." },
  { icon: FiBriefcase, title: "Industry exposure", text: "Industrial visits, training and a placement cell connect the classroom to real work." },
  { icon: FiUsers, title: "Care for every student", text: "Guidance, activities and facilities that help each student grow with confidence." },
];

const downloads = [
  { label: "Academic calendar, 2025-26", href: "/docs/academic-calendar-2025-26.pdf", type: "PDF" },
  { label: "Annual Report, 2024", href: "/docs/annual-report-2024.pdf", type: "PDF" },
];

export default function PrincipalMessage() {
  const { ready, content: savedContent } = useAboutPage("principal-message");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const principal = mergeAboutContent(defaultPrincipal, savedContent?.principal);
  const pillars = mergeAboutContent(defaultPillars, savedContent?.pillars);

  const initials = principal.name.replace(/^(Dr|Mr|Mrs|Sh)\.?\s+/i, "").split(" ").map((w) => w[0]).join("").slice(0, 2);

  if (!ready) return <main id="main" className="pm-page"><PageLoader /></main>;

  return (
    <main id="main" className="pm-page">
      {/* ---- hero ---- */}
      <section className="pm-hero" aria-label="Principal's desk" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="pm-hero__photo" />
        <div className="pm-hero__tags">
          <span className="pm-hero__tag pm-hero__tag--left">
            <span className="pm-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="pm-hero__tag pm-hero__tag--right">
            <span className="pm-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="pm-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Principal's desk</span>
        </nav>
      </section>

      <div className="container pm-layout">
        <div className="pm-content">
          <header className="pm-intro">
            <span className="pm-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <article id="message" className="pm-letter">
            <figure className="pm-portrait">
              <div className="pm-portrait__frame">
                <span aria-hidden="true">{initials}</span>
                <img src={mediaUrl(principal.photo)} alt={principal.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              </div>
              <figcaption>
                <strong>{principal.name}</strong>
                <span>{principal.role}</span>
              </figcaption>
            </figure>

            <div className="pm-message">
              <blockquote>{principal.quote}</blockquote>
              {principal.paragraphs.map((p) => <p key={p}>{p}</p>)}
              <p className="pm-sign">
                <span>With best wishes,</span>
                <strong>{principal.name}</strong>
                <em>{principal.role}</em>
              </p>
            </div>
          </article>

          <section className="pm-pillars" aria-labelledby="pm-pillars-title">
            <header className="pm-head">
              <span className="pm-eyebrow pm-eyebrow--dark">Our promise</span>
              <h2 id="pm-pillars-title">What every student can expect</h2>
            </header>
            <div className="pm-pillars__grid">
              {pillars.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.title}>
                    <span className="pm-pillars__no">0{index + 1}</span>
                    <span className="pm-pillars__icon"><Icon aria-hidden="true" /></span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="pm-side" aria-labelledby="pm-dl-title">
          <h2 id="pm-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="pm-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="pm-side__label">{item.label}</span>
                  <span className="pm-side__type">{item.type}</span>
                  <FiDownload className="pm-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
