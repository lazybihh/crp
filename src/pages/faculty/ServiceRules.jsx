import { mediaUrl } from "../../services/homeService";
import { getPolicy } from "../../services/facultyContentService";
import PageLoader, { usePageReady } from "../../components/PageLoader";
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

export default function ServiceRules(){
 const { ready, data: backendContent } = usePageReady(() => getPolicy("service-rules").then((row) => row.content || row));
 if (!ready) return <main data-faculty-content-key="service-rules" id="main" className="pol-page pol-service"><PageLoader /></main>;

 return <main data-faculty-content-key="service-rules" id="main" className="pol-page pol-service">
 <section className="pol-hero" aria-label="Service Rules" style={{"--pol-img":`url("${mediaUrl(backendContent?.heroImage && backendContent.heroImage !== "/images/pages-banner.png" ? backendContent.heroImage : "/images/campus-3.jpg")}")`}}>
  <div className="pol-hero__photo" />
  <div className="pol-hero__tags">
   <span className="pol-hero__tag pol-hero__tag--left"><span className="pol-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>{backendContent?.heroLeft || "Government Polytechnic"}</span>
   <span className="pol-hero__tag pol-hero__tag--right"><span className="pol-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>{backendContent?.heroRight || "Rohtak (Haryana)"}</span>
  </div>
  <nav className="pol-crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><FiChevronRight aria-hidden="true" /><span>Faculty</span><FiChevronRight aria-hidden="true" /><span aria-current="page">Service Rules</span></nav>
 </section>
 <div className="container pol-wrap">
  <header className="pol-intro"><span className="pol-eyebrow">Faculty · Policies &amp; Rules</span><h1>{backendContent?.title || "Service"} <em>{backendContent?.accent || "Rules"}</em></h1><p>{backendContent?.description || "Reference information for understanding the service rules and government instructions applicable to institute employees."}</p></header>
  <section className="pol-feature"><div className="pol-feature__mark"><FiFileText/></div><div><span className="pol-kicker">{backendContent?.featureKicker || "Official framework"}</span><h2>{backendContent?.featureTitle || "Refer to the rules that apply to your service"}</h2><p>{backendContent?.featureText || "The institute's website links to Haryana Government service rules. The applicable provisions may depend on the employee's post, service group and subsequent government amendments."}</p></div><span className="pol-feature__number">{backendContent?.featureNumber || "04"}</span></section>
  <section className="pol-section"><div className="pol-section__head"><span className="pol-eyebrow">{backendContent?.sectionEyebrow || "Reference areas"}</span><h2>{backendContent?.sectionTitle || "Common service-rule topics"}</h2><p>{backendContent?.sectionText || "This is a general navigation summary prepared for the redesigned page. It does not reproduce or replace the official rules."}</p></div><div className="pol-card-grid">{(backendContent?.cards?.length ? backendContent.cards : topics).map((item,i)=><article className="pol-card" key={item.title}><span className="pol-card__icon">{(() => { const Icon = topics[i % topics.length].icon; return <Icon/>; })()}</span><span className="pol-card__no">0{i+1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
  <section className="pol-section pol-process"><div className="pol-section__head"><span className="pol-eyebrow">{backendContent?.processEyebrow || "Before relying on a rule"}</span><h2>{backendContent?.processTitle || "Useful checks"}</h2></div><ol>{(backendContent?.steps?.length ? backendContent.steps : reminders).map((item,i)=><li key={item}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ol></section>
  <aside className="pol-note"><FiInfo/><div><strong>{backendContent?.noteTitle || "Official document and amendments"}</strong><p>{backendContent?.noteText || "The original website points to the Haryana Government's 2019 Group B Service Rules PDF. Add the verified document and any current amendments here once their exact official URLs and applicability are confirmed. Do not treat this sample summary as legal or employment advice."}</p></div></aside>
  <footer className="pol-bottom"><span>{backendContent?.relatedTitle || "Explore another policy"}</span><Link to="/faculty/training-policy">Training Policy <FiChevronRight/></Link><Link to="/faculty/anti-ragging">Anti Ragging <FiChevronRight/></Link><Link to="/faculty/anti-sexual-harassment">Anti Sexual Harassment <FiChevronRight/></Link></footer>
 </div>
</main>}
