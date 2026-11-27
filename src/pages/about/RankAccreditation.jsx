// RankAccreditation.jsx - About us > Rank & accreditation (route: /about/rank-accreditation).
// This page has its own hero, its own styles (rank-accreditation.css, every class starts with "rk-") and its own downloads sidebar.
// The status card below is a SAMPLE placeholder - replace it with the real rank and accreditation details.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload, FiAward, FiShield, FiCheckCircle, FiClock } from "react-icons/fi";
import "./Rank-accreditation.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const defaultHero = { image: "/images/campus-2.jpg" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Rank & accreditation",
  lead: "The approvals and affiliation that stand behind every diploma awarded here.",
};

const defaultApprovals = [
  { icon: FiAward, by: "AICTE, New Delhi", role: "Approved by", text: "The All India Council for Technical Education approves the diploma programmes and their intake." },
  { icon: FiShield, by: "HSBTE, Panchkula", role: "Affiliated to", text: "The Haryana State Board of Technical Education conducts the examinations and awards the diplomas." },
  { icon: FiCheckCircle, by: "DTE Haryana", role: "Recognised by", text: "The Directorate of Technical Education, Haryana, approves the courses and supports the institute with grant-in-aid." },
];

const defaultGlance = [
  { authority: "AICTE", purpose: "Approval of programmes and intake", document: "Extension of Approval, 2025-26" },
  { authority: "HSBTE", purpose: "Affiliation and examinations", document: "Affiliation, 2024-25" },
  { authority: "Institute", purpose: "Public information under RTI", document: "Mandatory Disclosure, 2025" },
];

const downloads = [
  { label: "Extension of Approval, 2025-26", href: "/docs/extension-of-approval-2025-26.pdf", type: "PDF" },
  { label: "Affiliation, 2024-25", href: "/docs/affiliation-2024-25.pdf", type: "PDF" },
  { label: "Mandatory Disclosure, 2025", href: "/docs/mandatory-disclosure-2025.pdf", type: "PDF" },
];

export default function RankAccreditation() {
  const { ready, content: savedContent } = useAboutPage("rank-accreditation");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const approvals = mergeAboutContent(defaultApprovals, savedContent?.approvals);
  const glance = mergeAboutContent(defaultGlance, savedContent?.glance);

  if (!ready) return <main id="main" className="rk-page"><PageLoader /></main>;

  return (
    <main id="main" className="rk-page">
      {/* ---- hero ---- */}
      <section className="rk-hero" aria-label="Rank and accreditation" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="rk-hero__photo" />
        <div className="rk-hero__tags">
          <span className="rk-hero__tag rk-hero__tag--left">
            <span className="rk-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="rk-hero__tag rk-hero__tag--right">
            <span className="rk-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="rk-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Rank & accreditation</span>
        </nav>
      </section>

      <div className="container rk-layout">
        <div className="rk-content">
          <header className="rk-intro">
            <span className="rk-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <section className="rk-block" aria-labelledby="rk-approvals-title">
            <header className="rk-head">
              <span className="rk-eyebrow rk-eyebrow--dark">Recognition</span>
              <h2 id="rk-approvals-title">Approved, affiliated, recognised</h2>
            </header>
            <div className="rk-badges">
              {approvals.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.by}>
                    <span className="rk-badges__icon"><Icon aria-hidden="true" /></span>
                    <span className="rk-badges__role">{item.role}</span>
                    <h3>{item.by}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rk-block" aria-labelledby="rk-glance-title">
            <header className="rk-head">
              <span className="rk-eyebrow rk-eyebrow--dark">At a glance</span>
              <h2 id="rk-glance-title">Who approves what</h2>
            </header>
            <div className="rk-table" role="table" aria-label="Approving bodies and documents">
              <div className="rk-table__row rk-table__row--head" role="row">
                <span role="columnheader">Authority</span>
                <span role="columnheader">What it covers</span>
                <span role="columnheader">Document</span>
              </div>
              {glance.map((row) => (
                <div className="rk-table__row" role="row" key={row.authority}>
                  <strong role="cell">{row.authority}</strong>
                  <span role="cell">{row.purpose}</span>
                  <span role="cell">{row.document}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rk-status" aria-labelledby="rk-status-title">
            <span className="rk-status__icon"><FiClock aria-hidden="true" /></span>
            <div>
              <h2 id="rk-status-title">Rank & accreditation status</h2>
              <p>The institute's rank and accreditation details are being prepared and will be published here as soon as they are available.</p>
            </div>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="rk-side" aria-labelledby="rk-dl-title">
          <h2 id="rk-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="rk-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="rk-side__label">{item.label}</span>
                  <span className="rk-side__type">{item.type}</span>
                  <FiDownload className="rk-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
