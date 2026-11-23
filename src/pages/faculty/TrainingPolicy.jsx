import { useEffect, useState } from "react";
import { getPolicy } from "../../services/facultyContentService";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiBookOpen, FiTarget, FiUsers, FiTrendingUp, FiCheckCircle, FiInfo } from "react-icons/fi";
import "./TrainingPolicy.css";

const focusAreas = [
  { icon: FiTarget, title: "Identify learning needs", text: "Recognise role-based learning needs and areas where additional skills or knowledge can support better performance." },
  { icon: FiBookOpen, title: "Build professional skills", text: "Encourage relevant technical, administrative and digital learning for teaching and support responsibilities." },
  { icon: FiUsers, title: "Share knowledge", text: "Support peer learning, orientation and the exchange of useful practices across departments." },
  { icon: FiTrendingUp, title: "Review development", text: "Reflect on completed learning and identify suitable next steps for continued professional growth." },
];
const stages = ["Understand the training requirement", "Identify a suitable programme or learning resource", "Participate in the planned learning activity", "Review learning outcomes and future needs"];

export default function TrainingPolicy() {
  const [backendContent, setBackendContent] = useState(null);
  useEffect(() => { let active = true; getPolicy("training-policy").then(row => { if (active) setBackendContent(row.content || row); }).catch(error => console.error("Faculty page content load failed:", error)); return () => { active = false; }; }, []);

  return (
    <main data-faculty-content-key="training-policy" id="main" className="pol-page pol-training">
      <section className="pol-hero" aria-label="Training Policy" style={{ "--pol-img": 'url("/images/pages-banner.png")' }}>
        <div className="pol-hero__photo" />
        <div className="pol-hero__tags">
          <span className="pol-hero__tag pol-hero__tag--left"><span className="pol-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>Government Polytechnic</span>
          <span className="pol-hero__tag pol-hero__tag--right"><span className="pol-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>Rohtak (Haryana)</span>
        </div>
        <nav className="pol-crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><FiChevronRight aria-hidden="true" /><span>Faculty</span><FiChevronRight aria-hidden="true" /><span aria-current="page">Training Policy</span></nav>
      </section>
      <div className="container pol-wrap">
        <header className="pol-intro"><span className="pol-eyebrow">Faculty · Policies &amp; Rules</span><h1>Training <em>Policy</em></h1><p>{backendContent?.description || "Supporting continuous learning, professional development and the sharing of knowledge across the institute."}</p></header>
        <section className="pol-feature"><div className="pol-feature__mark"><FiBookOpen /></div><div><span className="pol-kicker">Professional development</span><h2>Learning that strengthens the institution</h2><p>A clear training approach helps faculty and staff keep their knowledge current, strengthen day-to-day skills and respond to changing academic and administrative needs.</p></div><span className="pol-feature__number">01</span></section>
        <section className="pol-section"><div className="pol-section__head"><span className="pol-eyebrow">Key focus areas</span><h2>What training can support</h2><p>The following is an illustrative overview for this redesigned page, not a replacement for the institute's approved policy document.</p></div><div className="pol-card-grid">{focusAreas.map(({icon:Icon,title,text},i)=><article className="pol-card" key={title}><span className="pol-card__icon"><Icon /></span><span className="pol-card__no">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
        <section className="pol-section pol-process"><div className="pol-section__head"><span className="pol-eyebrow">A simple framework</span><h2>From need to learning</h2></div><ol>{stages.map((stage,i)=><li key={stage}><span>{String(i+1).padStart(2,"0")}</span><p>{stage}</p>{i!==stages.length-1&&<FiChevronRight />}</li>)}</ol></section>
        <aside className="pol-note"><FiInfo /><div><strong>Official document</strong><p>The original website lists a staff training policy PDF. Its document link was not accessible during this review, so no clauses, eligibility rules or mandatory training requirements have been invented here. Add the approved PDF when it is available.</p></div></aside>
        <footer className="pol-bottom"><span>Explore another policy</span><Link to="/faculty/anti-ragging">Anti Ragging <FiChevronRight /></Link><Link to="/faculty/anti-sexual-harassment">Anti Sexual Harassment <FiChevronRight /></Link><Link to="/faculty/service-rules">Service Rules <FiChevronRight /></Link></footer>
      </div>
    </main>
  );
}
