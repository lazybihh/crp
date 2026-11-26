// Luminaries.jsx - About us > Luminaries (route: /about/luminaries).
// This page has its own hero, its own styles (Luminaries.css, every class starts with "lum-") and its own downloads sidebar.
// The three leaders below come from the Home page leadership cards;
// the "distinguished alumni and guests" cards are SAMPLE placeholders - replace them with real names.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload, FiStar } from "react-icons/fi";
import "./Luminaries.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const img = (file) => `/images/${file}`;

const defaultHero = { image: "/images/pages-banner.png" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Luminaries",
  lead: "The people whose vision, leadership and work shaped the institute and keep it moving forward.",
};

// Same people and text as the Home page leadership section.
const defaultFounder = {
  name: "Deenbandhu Sir Chhotu Ram",
  role: "The Messiah of Farmers",
  text: "A great statesman, social reformer and the voice of the farmers. His vision for rural upliftment and education continues to inspire us.",
  image: img("leader-chhotu-ram.jpg"),
  initials: "CR",
};

const defaultLeaders = [
  {
    name: "Sh. Gulab Singh",
    role: "President, JES Society (Regd.)",
    text: "Committed to providing better academic and infrastructure facilities for the overall growth of our students.",
    image: img("leader-gulab-singh.jpg"),
    initials: "GS",
  },
  {
    name: "Dr. Sitender Kumar",
    role: "Principal, Chhotu Ram Polytechnic",
    text: "Dedicated to maintaining high standards of technical education and ensuring a bright and successful future for our students.",
    image: img("principal.png"),
    initials: "SK",
  },
];

// SAMPLE: replace with real alumni, guests or award winners (name, role / batch, one line).
const defaultDistinguished = [
  { name: "Distinguished alumnus", role: "Batch year, Civil Engineering", text: "A short line about the career or contribution that makes this person a luminary of the institute." },
  { name: "Distinguished alumnus", role: "Batch year, Electrical Engineering", text: "A short line about the career or contribution that makes this person a luminary of the institute." },
  { name: "Distinguished guest", role: "Designation, organisation", text: "A short line about the visit, lecture or support this guest gave to the institute." },
];

const downloads = [
  { label: "Annual Report, 2024", href: "/docs/annual-report-2024.pdf", type: "PDF" },
];

function Portrait({ person }) {
  return (
    <div className="lum-photo">
      <span aria-hidden="true">{person.initials}</span>
      <img src={mediaUrl(person.image)} alt={person.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
    </div>
  );
}

export default function Luminaries() {
  const { ready, content: savedContent } = useAboutPage("luminaries");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const founder = mergeAboutContent(defaultFounder, savedContent?.founder);
  const leaders = mergeAboutContent(defaultLeaders, savedContent?.leaders);
  const distinguished = mergeAboutContent(defaultDistinguished, savedContent?.distinguished);

  if (!ready) return <main id="main" className="lum-page"><PageLoader /></main>;

  return (
    <main id="main" className="lum-page">
      {/* ---- hero ---- */}
      <section className="lum-hero" aria-label="Luminaries" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="lum-hero__photo" />
        <div className="lum-hero__tags">
          <span className="lum-hero__tag lum-hero__tag--left">
            <span className="lum-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="lum-hero__tag lum-hero__tag--right">
            <span className="lum-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="lum-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Luminaries</span>
        </nav>
      </section>

      <div className="container lum-layout">
        <div className="lum-content">
          {/* ---- title (level with the downloads card) ---- */}
          <header className="lum-intro">
            <span className="lum-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <article className="lum-founder" aria-label={founder.name}>
            <Portrait person={founder} />
            <div>
              <span className="lum-eyebrow lum-eyebrow--light">Our inspiration</span>
              <h2>{founder.name}</h2>
              <p className="lum-founder__role">{founder.role}</p>
              <p>{founder.text}</p>
            </div>
          </article>

          <section className="lum-block" aria-labelledby="lum-lead-title">
            <header className="lum-head">
              <span className="lum-eyebrow lum-eyebrow--dark">Leadership</span>
              <h2 id="lum-lead-title">Guiding the institute today</h2>
            </header>
            <div className="lum-leaders">
              {leaders.map((person) => (
                <article key={person.name}>
                  <Portrait person={person} />
                  <div>
                    <h3>{person.name}</h3>
                    <p className="lum-leaders__role">{person.role}</p>
                    <p>{person.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="lum-block" aria-labelledby="lum-dist-title">
            <header className="lum-head">
              <span className="lum-eyebrow lum-eyebrow--dark">Distinguished alumni & guests</span>
              <h2 id="lum-dist-title">Those who made us proud</h2>
            </header>
            <div className="lum-dist">
              {distinguished.map((person, index) => (
                <article key={index}>
                  <span className="lum-dist__icon"><FiStar aria-hidden="true" /></span>
                  <h3>{person.name}</h3>
                  <p className="lum-dist__role">{person.role}</p>
                  <p>{person.text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="lum-side" aria-labelledby="lum-dl-title">
          <h2 id="lum-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="lum-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="lum-side__label">{item.label}</span>
                  <span className="lum-side__type">{item.type}</span>
                  <FiDownload className="lum-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
