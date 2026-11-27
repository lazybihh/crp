import { mediaUrl } from "../../services/homeService";
import { getService } from "../../services/facultyContentService";
import PageLoader, { usePageReady } from "../../components/PageLoader";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiCheckCircle, FiBookOpen, FiUsers, FiTrendingUp, FiClipboard, FiInfo } from "react-icons/fi";
import "./IQAC.css";

const pillars = [
  { icon: FiBookOpen, title: "Academic quality", text: "Encourage thoughtful review of teaching, learning resources and academic practices." },
  { icon: FiUsers, title: "Stakeholder feedback", text: "Use feedback from students, faculty and other stakeholders to identify areas for improvement." },
  { icon: FiClipboard, title: "Review and documentation", text: "Keep quality-related activities, observations and improvement actions organised." },
  { icon: FiTrendingUp, title: "Continuous improvement", text: "Review outcomes and identify practical steps that can strengthen institutional processes." },
];

export default function IQAC() {
  const { ready, data: backendContent } = usePageReady(() => getService("iqac").then((row) => row.content || row));

  if (!ready) return <main data-faculty-content-key="iqac" id="main" className="svc-page svc-iqac"><PageLoader /></main>;

  return (
    <main data-faculty-content-key="iqac" id="main" className="svc-page svc-iqac">
      <section className="svc-hero" aria-label="IQAC" style={{ "--svc-img": `url("${mediaUrl(backendContent?.heroImage && backendContent.heroImage !== "/images/pages-banner.png" ? backendContent.heroImage : "/images/campus-3.jpg")}")` }}>
        <div className="svc-hero__photo" />
        <div className="svc-hero__tags">
          <span className="svc-hero__tag svc-hero__tag--left"><span className="svc-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>{backendContent?.heroLeft || "Government Polytechnic"}</span>
          <span className="svc-hero__tag svc-hero__tag--right"><span className="svc-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>{backendContent?.heroRight || "Rohtak (Haryana)"}</span>
        </div>
        <nav className="svc-crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><FiChevronRight aria-hidden="true" /><span>Faculty</span><FiChevronRight aria-hidden="true" /><span aria-current="page">IQAC</span></nav>
      </section>
      <div className="container svc-wrap">
        <header className="svc-intro"><span className="svc-eyebrow">Faculty · Services</span><h1>{backendContent?.title || "Internal Quality"} <em>{backendContent?.accent || "Assurance Cell"}</em></h1><p>{backendContent?.description || "A focus on reviewing institutional practices, encouraging feedback and supporting continuous improvement."}</p></header>
        <section className="svc-feature"><span className="svc-feature__icon"><FiCheckCircle /></span><div><span className="svc-kicker">{backendContent?.featureKicker || "Official website information"}</span><h2>{backendContent?.featureTitle || "Quality assurance at the institute"}</h2><p>{backendContent?.featureText || "The institute's IQAC page states that AICTE parameters under the Internal Quality Assurance Cell have been evaluated and implemented. This page presents that information in a clearer format."}</p></div><span className="svc-feature__number">{backendContent?.featureNumber || "01"}</span></section>
        <section className="svc-section"><header className="svc-section__head"><span className="svc-eyebrow">{backendContent?.sectionEyebrow || "Illustrative framework"}</span><h2>{backendContent?.sectionTitle || "Areas that support quality"}</h2><p>{backendContent?.sectionText || "The following themes are sample presentation content, not a published list of official IQAC activities."}</p></header><div className="svc-grid">{(backendContent?.cards?.length ? backendContent.cards : pillars).map((item,i)=><article className="svc-card" key={item.title}><span className="svc-card__icon">{(() => { const Icon = pillars[i % pillars.length].icon; return <Icon />; })()}</span><span className="svc-card__number">0{i+1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
        <aside className="svc-note"><FiInfo /><div><strong>{backendContent?.noteTitle || "Content note"}</strong><p>{backendContent?.noteText || "The live IQAC page provides only a brief statement and does not publish committee members, meeting minutes, annual reports or contact details. These have not been invented. Add verified documents when the institute provides them."}</p></div></aside>
        <footer className="svc-related"><span>{backendContent?.relatedTitle || "Explore faculty services"}</span><Link to="/faculty/hrms">HRMS <FiChevronRight /></Link><Link to="/faculty/e-services">E-services <FiChevronRight /></Link></footer>
      </div>
    </main>
  );
}
