import { useEffect, useState } from "react";
import { getService } from "../../services/facultyContentService";
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
  const [backendContent, setBackendContent] = useState(null);
  useEffect(() => { let active = true; getService("iqac").then(row => { if (active) setBackendContent(row.content || row); }).catch(error => console.error("Faculty page content load failed:", error)); return () => { active = false; }; }, []);

  return (
    <main data-faculty-content-key="iqac" id="main" className="svc-page svc-iqac">
      <section className="svc-hero" aria-label="IQAC" style={{ "--svc-img": 'url("/images/pages-banner.png")' }}>
        <div className="svc-hero__photo" />
        <div className="svc-hero__tags">
          <span className="svc-hero__tag svc-hero__tag--left"><span className="svc-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>Government Polytechnic</span>
          <span className="svc-hero__tag svc-hero__tag--right"><span className="svc-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>Rohtak (Haryana)</span>
        </div>
        <nav className="svc-crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><FiChevronRight aria-hidden="true" /><span>Faculty</span><FiChevronRight aria-hidden="true" /><span aria-current="page">IQAC</span></nav>
      </section>
      <div className="container svc-wrap">
        <header className="svc-intro"><span className="svc-eyebrow">Faculty · Services</span><h1>Internal Quality <em>Assurance Cell</em></h1><p>{backendContent?.description || "A focus on reviewing institutional practices, encouraging feedback and supporting continuous improvement."}</p></header>
        <section className="svc-feature"><span className="svc-feature__icon"><FiCheckCircle /></span><div><span className="svc-kicker">Official website information</span><h2>Quality assurance at the institute</h2><p>The institute's IQAC page states that AICTE parameters under the Internal Quality Assurance Cell have been evaluated and implemented. This page presents that information in a clearer format.</p></div><span className="svc-feature__number">01</span></section>
        <section className="svc-section"><header className="svc-section__head"><span className="svc-eyebrow">Illustrative framework</span><h2>Areas that support quality</h2><p>The following themes are sample presentation content, not a published list of official IQAC activities.</p></header><div className="svc-grid">{pillars.map(({icon:Icon,title,text},i)=><article className="svc-card" key={title}><span className="svc-card__icon"><Icon /></span><span className="svc-card__number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
        <aside className="svc-note"><FiInfo /><div><strong>Content note</strong><p>The live IQAC page provides only a brief statement and does not publish committee members, meeting minutes, annual reports or contact details. These have not been invented. Add verified documents when the institute provides them.</p></div></aside>
        <footer className="svc-related"><span>Explore faculty services</span><Link to="/faculty/hrms">HRMS <FiChevronRight /></Link><Link to="/faculty/e-services">E-services <FiChevronRight /></Link></footer>
      </div>
    </main>
  );
}
