import { useEffect, useState } from "react";
import { getPolicy } from "../../services/facultyContentService";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiBriefcase, FiClipboard, FiUsers, FiInfo } from "react-icons/fi";
import "./ServiceRules.css";

const topics=[
 {icon:FiBriefcase,title:"Service conditions",text:"Conditions of service are governed by the applicable Haryana Government rules, notifications and orders for the relevant employee category."},
 {icon:FiUsers,title:"Roles and responsibilities",text:"Employees are expected to carry out assigned duties professionally and follow the institute's applicable administrative procedures."},
 {icon:FiClipboard,title:"Leave and attendance",text:"Leave, attendance and related matters are handled under the rules and instructions applicable to the employee's post and service category."},
 {icon:FiFileText,title:"Official amendments",text:"Updates and clarifications should be taken from the latest government notifications and competent authority instructions."},
];
const reminders=["Check the rule set applicable to the employee's post and service category", "Refer to the latest government notification or amendment", "Confirm interpretation with the competent administrative authority"];

export default function ServiceRules(){return <main data-faculty-content-key="service-rules" id="main" className="pol-page pol-service">
 <section className="pol-hero" aria-label="Service Rules" style={{"--pol-img":'url("/images/pages-banner.png")'}}>
  <div className="pol-hero__photo" />
  <div className="pol-hero__tags">
   <span className="pol-hero__tag pol-hero__tag--left"><span className="pol-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>Government Polytechnic</span>
   <span className="pol-hero__tag pol-hero__tag--right"><span className="pol-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>Rohtak (Haryana)</span>
  </div>
  <nav className="pol-crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><FiChevronRight aria-hidden="true" /><span>Faculty</span><FiChevronRight aria-hidden="true" /><span aria-current="page">Service Rules</span></nav>
 </section>
 <div className="container pol-wrap">
  <header className="pol-intro"><span className="pol-eyebrow">Faculty · Policies &amp; Rules</span><h1>Service <em>Rules</em></h1><p>{backendContent?.description || "Reference information for understanding the service rules and government instructions applicable to institute employees."}</p></header>
  <section className="pol-feature"><div className="pol-feature__mark"><FiFileText/></div><div><span className="pol-kicker">Official framework</span><h2>Refer to the rules that apply to your service</h2><p>The institute's website links to Haryana Government service rules. The applicable provisions may depend on the employee's post, service group and subsequent government amendments.</p></div><span className="pol-feature__number">04</span></section>
  <section className="pol-section"><div className="pol-section__head"><span className="pol-eyebrow">Reference areas</span><h2>Common service-rule topics</h2><p>This is a general navigation summary prepared for the redesigned page. It does not reproduce or replace the official rules.</p></div><div className="pol-card-grid">{topics.map(({icon:Icon,title,text},i)=><article className="pol-card" key={title}><span className="pol-card__icon"><Icon/></span><span className="pol-card__no">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="pol-section pol-process"><div className="pol-section__head"><span className="pol-eyebrow">Before relying on a rule</span><h2>Useful checks</h2></div><ol>{reminders.map((item,i)=><li key={item}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ol></section>
  <aside className="pol-note"><FiInfo/><div><strong>Official document and amendments</strong><p>The original website points to the Haryana Government's 2019 Group B Service Rules PDF. Add the verified document and any current amendments here once their exact official URLs and applicability are confirmed. Do not treat this sample summary as legal or employment advice.</p></div></aside>
  <footer className="pol-bottom"><span>Explore another policy</span><Link to="/faculty/training-policy">Training Policy <FiChevronRight/></Link><Link to="/faculty/anti-ragging">Anti Ragging <FiChevronRight/></Link><Link to="/faculty/anti-sexual-harassment">Anti Sexual Harassment <FiChevronRight/></Link></footer>
 </div>
</main>}
