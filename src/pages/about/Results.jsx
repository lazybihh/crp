// Results.jsx - About us > Results (route: /about/results).
// This page has its own hero, its own styles (results.css, every class starts with "res-") and its own downloads sidebar.
// The page lists the result files as session cards and adds short explanatory blocks (marked SAMPLE).
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload, FiExternalLink, FiAward, FiArrowUpRight } from "react-icons/fi";
import "./Results.css";
import { useSite } from "../../context/SiteSettingsContext";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const defaultHero = { image: "/images/campus-3.jpg" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Results",
  lead: "Session-wise result sheets of the institute, newest first.",
};

// Local files go in public/docs. The March 2024 sheet stays on Google Drive.
// If a result sheet is several files, save it as a .zip instead and change the extension below.
const defaultSheets = [
  { month: "Mar", year: "2024", title: "Result sheet, March 2024", note: "Opens the result folder on Google Drive", href: "https://drive.google.com/drive/folders/1-B4t11czRaHKvIBCm-HfJkT6F2BmnHzJ?usp=drive_link", type: "Drive", external: true },
  { month: "Feb", year: "2023", title: "Result sheet, February 2023", note: "Session result sheet", href: "/docs/result-sheet-february-2023.pdf", type: "PDF" },
  { month: "Jul", year: "2022", title: "Result sheet, July 2022", note: "Session result sheet", href: "/docs/result-sheet-july-2022.pdf", type: "PDF" },
];

// SAMPLE: generic steps - check them against the HSBTE website before publishing.
const defaultSteps = [
  { title: "Open the HSBTE website", text: "Results and marks are declared by the Haryana State Board of Technical Education, Panchkula." },
  { title: "Choose your examination", text: "Open the results section and select the session of your examination." },
  { title: "Enter your roll number", text: "View your result and save a copy for your records." },
];

const downloads = [
  { label: "Academic calendar, 2025-26", href: "/docs/academic-calendar-2025-26.pdf", type: "PDF" },
  { label: "Annual Report, 2024", href: "/docs/annual-report-2024.pdf", type: "PDF" },
];

export default function Results() {
  const { ready, content: savedContent } = useAboutPage("results");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const sheets = mergeAboutContent(defaultSheets, savedContent?.sheets);
  const steps = mergeAboutContent(defaultSteps, savedContent?.steps);

  const { links } = useSite();
  if (!ready) return <main id="main" className="res-page"><PageLoader /></main>;

  return (
    <main id="main" className="res-page">
      {/* ---- hero ---- */}
      <section className="res-hero" aria-label="Results" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="res-hero__photo" />
        <div className="res-hero__tags">
          <span className="res-hero__tag res-hero__tag--left">
            <span className="res-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="res-hero__tag res-hero__tag--right">
            <span className="res-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="res-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Results</span>
        </nav>
      </section>

      <div className="container res-layout">
        <div className="res-content">
          {/* ---- title (level with the downloads card) ---- */}
          <header className="res-intro">
            <span className="res-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <section className="res-block" aria-labelledby="res-sheets-title">
            <header className="res-head">
              <span className="res-eyebrow res-eyebrow--dark">Result archive</span>
              <h2 id="res-sheets-title">Result sheets</h2>
            </header>
            <ol className="res-sheets">
              {sheets.map((sheet) => (
                <li key={sheet.title}>
                  <a href={sheet.href} target="_blank" rel="noopener noreferrer">
                    <span className="res-sheets__date">
                      <strong>{sheet.month}</strong>
                      <span>{sheet.year}</span>
                    </span>
                    <span className="res-sheets__body">
                      <span className="res-sheets__title">{sheet.title}</span>
                      <span className="res-sheets__note">{sheet.note}</span>
                    </span>
                    <span className="res-sheets__type">{sheet.type}</span>
                    <span className="res-sheets__go">
                      {sheet.external ? <FiExternalLink aria-hidden="true" /> : <FiDownload aria-hidden="true" />}
                      <span className="res-sr">{sheet.external ? "Open" : "Download"}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </section>

          <section className="res-block" aria-labelledby="res-how-title">
            <header className="res-head">
              <span className="res-eyebrow res-eyebrow--dark">Official results</span>
              <h2 id="res-how-title">How to see your own result</h2>
            </header>
            <ol className="res-steps">
              {steps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
            {links?.hsbte && <a className="res-pill" href={links.hsbte} target="_blank" rel="noopener noreferrer">
              Go to HSBTE <FiArrowUpRight aria-hidden="true" />
            </a>}
          </section>

          <section className="res-toppers" aria-labelledby="res-top-title">
            <span className="res-toppers__icon"><FiAward aria-hidden="true" /></span>
            <div>
              <h2 id="res-top-title">Toppers and achievers</h2>
              <p>Session toppers and their photographs will be shown here after each result is declared.</p>
            </div>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="res-side" aria-labelledby="res-dl-title">
          <h2 id="res-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="res-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="res-side__label">{item.label}</span>
                  <span className="res-side__type">{item.type}</span>
                  <FiDownload className="res-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
