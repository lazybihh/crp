import { useEffect, useState } from "react";
import { getService } from "../../services/facultyContentService";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiExternalLink, FiBookOpen, FiBriefcase, FiInfo } from "react-icons/fi";
import "./FacultyEServices.css";

const services = [
  { icon: FiBookOpen, title: "CDTP", text: "The official Faculty E-Services page lists CDTP as an available service.", status: "Listed on official website", href: "" },
  { icon: FiBriefcase, title: "Apprenticeship", text: "The official Faculty E-Services page also lists Apprenticeship.", status: "Listed on official website", href: "" },
];

export default function FacultyEServices() {
  const [backendContent, setBackendContent] = useState(null);
  useEffect(() => { let active = true; getService("e-services").then(row => { if (active) setBackendContent(row.content || row); }).catch(error => console.error("Faculty page content load failed:", error)); return () => { active = false; }; }, []);

  return (
    <main data-faculty-content-key="e-services" id="main" className="svc-page svc-eservices">
      <section className="svc-hero" aria-label="Faculty E-services" style={{ "--svc-img": 'url("/images/pages-banner.png")' }}>
        <div className="svc-hero__photo" />
        <div className="svc-hero__tags">
          <span className="svc-hero__tag svc-hero__tag--left"><span className="svc-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>Government Polytechnic</span>
          <span className="svc-hero__tag svc-hero__tag--right"><span className="svc-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>Rohtak (Haryana)</span>
        </div>
        <nav className="svc-crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><FiChevronRight aria-hidden="true" /><span>Faculty</span><FiChevronRight aria-hidden="true" /><span aria-current="page">E-services</span></nav>
      </section>
      <div className="container svc-wrap">
        <header className="svc-intro"><span className="svc-eyebrow">Faculty · Services</span><h1>Faculty <em>E-services</em></h1><p>{backendContent?.description || "Quick access to the online services listed for faculty and staff by Chhotu Ram Polytechnic."}</p></header>
        <section className="svc-section svc-section--first"><header className="svc-section__head"><span className="svc-eyebrow">Available services</span><h2>Choose a service</h2><p>The official page lists the following two services. Destination links are not published there, so no unverified links have been added.</p></header><div className="svc-grid svc-grid--two">{services.map(({icon:Icon,title,text,status})=><article className="svc-card svc-service-card" key={title}><span className="svc-card__icon"><Icon /></span><span className="svc-card__number">{status}</span><h3>{title}</h3><p>{text}</p><span className="svc-coming">Official destination link not provided</span></article>)}</div></section>
        <aside className="svc-note"><FiInfo /><div><strong>Need a direct link?</strong><p>Ask the institute to confirm the correct CDTP and Apprenticeship portal URLs before publishing external buttons. This avoids sending faculty to an incorrect or unofficial website.</p></div></aside>
        <footer className="svc-related"><span>Explore faculty services</span><Link to="/faculty/iqac">IQAC <FiChevronRight /></Link><Link to="/faculty/hrms">HRMS <FiChevronRight /></Link></footer>
      </div>
    </main>
  );
}
