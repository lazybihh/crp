// AnnualReport.jsx - About us > Annual report (route: /about/annual-report).
// Its own hero, its own styles (AnnualReport.css, every class starts with "ann-") and a downloads sidebar.
// The banner, the title text and the report files come from the database (edited in Admin > About us > Annual report).
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload } from "react-icons/fi";
import "./AnnualReport.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const defaultHero = { image: "/images/pages-banner.png" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Annual reports",
  lead: "Annual reports and institutional documents of Chhotu Ram Polytechnic.",
};

// Report files go in public/docs (or are uploaded from the admin).
const downloads = [
  { label: "Annual Report, 2024", href: "/docs/annual-report-2024.pdf", type: "PDF" },
];

export default function AnnualReport() {
  const { ready, content: savedContent } = useAboutPage("annual-report");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);

  if (!ready) return <main id="main" className="ann-page"><PageLoader /></main>;
  return (
    <main id="main" className="ann-page">
      {/* ---- hero ---- */}
      <section className="ann-hero" aria-label="Annual report" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="ann-hero__photo" />
        <div className="ann-hero__tags">
          <span className="ann-hero__tag ann-hero__tag--left">
            <span className="ann-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="ann-hero__tag ann-hero__tag--right">
            <span className="ann-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="ann-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Annual report</span>
        </nav>
      </section>

      <div className="container ann-layout">
        <div className="ann-content">
          <header className="ann-intro">
            <span className="ann-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>
        </div>

        {/* ---- sidebar: the report files ---- */}
        <aside className="ann-side" aria-labelledby="ann-dl-title">
          <h2 id="ann-dl-title">Reports</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="ann-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="ann-side__label">{item.label}</span>
                  <span className="ann-side__type">{item.type}</span>
                  <FiDownload className="ann-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
