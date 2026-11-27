// History.jsx - About us > History (route: /about/history).
// This page has its own hero, its own styles (history.css, every class starts with "hist-") and its own downloads sidebar.
// Text marked SAMPLE is placeholder text - replace it when real content is available.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload } from "react-icons/fi";
import "./History.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const defaultHero = { image: "/images/campus-3.jpg" }; // if it is missing a navy gradient shows instead

const defaultIntro = {
  eyebrow: "About us",
  title: "History of C.R. Polytechnic",
  lead: "From two-year draftsman courses to six three-year diplomas - the story of a leading technical institute of Northern India.",
};

const defaultStory = [
  "This leading technical institute of Northern India began with two-year courses in draftsman (Civil) at the time of its inception. Today it offers three-year diplomas in Civil, Electrical, Mechanical, Electronics & Communication, Plastic Technology and Computer Engineering, introduced from time to time.",
  "All the courses have been duly approved by the Director of Technical Education, Haryana, and the All India Council for Technical Education, New Delhi. The Haryana Government has always been kind and liberal in granting aid to the institute, and the institute has worked day and night for the all-round development of its students.",
  "The sincere and complete involvement of management and staff can be seen in the results achieved by the students in academics as well as in various extra-curricular activities.",
];

const defaultFacts = [
  { value: "1956", label: "Serving students since" },
  { value: "1949", label: "NCC unit instituted" },
  { value: "6", label: "Three-year diplomas" },
  { value: "2", label: "Foundation departments" },
];

// SAMPLE: add more milestones when the real dates are known. Unknown years are written as words on purpose.
const defaultTimeline = [
  { when: "1949", title: "NCC unit instituted", text: "The institute's NCC unit begins, building discipline and service among cadets." },
  { when: "1956", title: "The institute begins", text: "Two-year draftsman (Civil) courses start - the first step in a long journey of technical education." },
  { when: "Later years", title: "New trades are added", text: "Electrical, Mechanical, Electronics & Communication, Plastic Technology and Computer Engineering are introduced one by one." },
  { when: "Today", title: "Six diplomas, one campus", text: "Three-year diplomas approved by DTE Haryana and AICTE, supported by Applied Sciences and the Workshop Department." },
];

const defaultMission = [
  "Meet the needs of industry and commerce by supplying skilled graduates and promoting technology transfer.",
  "Deliver high-quality diploma-level teaching that empowers students to handle technological and socio-economic challenges.",
  "Expand the diploma programmes and strengthen partnerships with industry as technology advances.",
  "Develop the faculty and supporting staff.",
  "Set trends and serve as a model for other technical institutions.",
  "Support national development and promote national integration.",
  "Instil moral values in students.",
];

const downloads = [
  { label: "Extension of Approval, 2025-26", href: "/docs/extension-of-approval-2025-26.pdf", type: "PDF" },
  { label: "Affiliation, 2024-25", href: "/docs/affiliation-2024-25.pdf", type: "PDF" },
  { label: "Mandatory Disclosure, 2025", href: "/docs/mandatory-disclosure-by-2025.docx", type: "DOCX" },
];

export default function History() {
  const { ready, content: savedContent } = useAboutPage("history");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const story = mergeAboutContent(defaultStory, savedContent?.story);
  const facts = mergeAboutContent(defaultFacts, savedContent?.facts);
  const timeline = mergeAboutContent(defaultTimeline, savedContent?.timeline);
  const mission = mergeAboutContent(defaultMission, savedContent?.mission);

  if (!ready) return <main id="main" className="hist-page"><PageLoader /></main>;

  return (
    <main id="main" className="hist-page">
      {/* ---- hero ---- */}
      <section className="hist-hero" aria-label="History of Chhotu Ram Polytechnic" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="hist-hero__photo" />
        <div className="hist-hero__tags">
          <span className="hist-hero__tag hist-hero__tag--left">
            <span className="hist-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="hist-hero__tag hist-hero__tag--right">
            <span className="hist-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="hist-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">History</span>
        </nav>
      </section>

      <div className="container hist-layout">
        <div className="hist-content">
          <header className="hist-intro">
            <span className="hist-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <section className="hist-story" aria-label="Our story">
            {story.map((p) => <p key={p}>{p}</p>)}
          </section>

          <dl className="hist-facts">
            {facts.map((fact) => (
              <div key={fact.label}><dt>{fact.value}</dt><dd>{fact.label}</dd></div>
            ))}
          </dl>

          <section id="journey" className="hist-block" aria-labelledby="hist-journey-title">
            <header className="hist-head">
              <span className="hist-eyebrow hist-eyebrow--dark">Milestones</span>
              <h2 id="hist-journey-title">Our journey</h2>
            </header>
            <ol className="hist-timeline">
              {timeline.map((step) => (
                <li key={step.title}>
                  <span className="hist-timeline__when">{step.when}</span>
                  <div className="hist-timeline__card"><h3>{step.title}</h3><p>{step.text}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section id="mission" className="hist-block" aria-labelledby="hist-mission-title">
            <header className="hist-head">
              <span className="hist-eyebrow hist-eyebrow--dark">Our mission</span>
              <h2 id="hist-mission-title">What the institute stands for</h2>
            </header>
            <ol className="hist-mission">
              {mission.map((goal, index) => (
                <li key={goal}><span className="hist-mission__no">{String(index + 1).padStart(2, "0")}</span><p>{goal}</p></li>
              ))}
            </ol>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="hist-side" aria-labelledby="hist-dl-title">
          <h2 id="hist-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="hist-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="hist-side__label">{item.label}</span>
                  <span className="hist-side__type">{item.type}</span>
                  <FiDownload className="hist-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
