// UnnatBharatAbhiyan.jsx - About us > Unnat Bharat Abhiyan (route: /about/unnat-bharat-abhiyan).
// This page has its own hero, its own styles (Unnat-bharat-abhiyan.css, every class starts with "uba-") and its own downloads sidebar.
// All of the text below is SAMPLE - confirm it with the UBA coordinator
// and replace it with the institute's real work (villages adopted, activities, dates).
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload, FiHome, FiClipboard, FiTool, FiHeart, FiUsers } from "react-icons/fi";
import "./UnnatBharatAbhiyan.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const defaultHero = { image: "/images/campus-workshop.jpg" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Unnat Bharat Abhiyan",
  lead: "Taking the institute's knowledge to nearby villages - and learning from them in return.", // SAMPLE
};

const defaultAbout = "Unnat Bharat Abhiyan is a national programme in which higher education institutions work with nearby villages to find local needs and help solve them with technology, skills and awareness. At our institute, students and staff take part together."; // SAMPLE

const defaultActivities = [
  { icon: FiHome, title: "Adopt villages", text: "The institute works with a small group of nearby villages over a longer period." },
  { icon: FiClipboard, title: "Understand needs", text: "Students survey the village and list its needs in water, energy, health and livelihood." },
  { icon: FiTool, title: "Skills and technology", text: "Workshops and simple technology solutions prepared in our labs and workshop." },
  { icon: FiHeart, title: "Awareness drives", text: "Camps and sessions on health, hygiene, cleanliness and digital literacy." },
];

const defaultSteps = [
  { title: "Join the team", text: "Students sign up with the programme coordinator." },
  { title: "Visit the village", text: "Small groups visit with a teacher and meet the community." },
  { title: "Plan and act", text: "Choose one need and work on it with the villagers." },
  { title: "Report back", text: "Share the results with the institute and the village." },
];

// SAMPLE file: the UBA report does not exist yet. Put the real file in public/docs or remove this item.
const downloads = [
  { label: "UBA activity report", href: "/docs/uba-activity-report.pdf", type: "PDF" },
];

export default function UnnatBharatAbhiyan() {
  const { ready, content: savedContent } = useAboutPage("unnat-bharat-abhiyan");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const about = mergeAboutContent(defaultAbout, savedContent?.about);
  const activities = mergeAboutContent(defaultActivities, savedContent?.activities);
  const steps = mergeAboutContent(defaultSteps, savedContent?.steps);

  if (!ready) return <main id="main" className="uba-page"><PageLoader /></main>;

  return (
    <main id="main" className="uba-page">
      {/* ---- hero ---- */}
      <section className="uba-hero" aria-label="Unnat Bharat Abhiyan" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="uba-hero__photo" />
        <div className="uba-hero__tags">
          <span className="uba-hero__tag uba-hero__tag--left">
            <span className="uba-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="uba-hero__tag uba-hero__tag--right">
            <span className="uba-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="uba-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Unnat Bharat Abhiyan</span>
        </nav>
      </section>

      <div className="container uba-layout">
        <div className="uba-content">
          {/* ---- title (level with the downloads card) ---- */}
          <header className="uba-intro">
            <span className="uba-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <p className="uba-about">{about}</p>

          <section className="uba-block" aria-labelledby="uba-act-title">
            <header className="uba-head">
              <span className="uba-eyebrow uba-eyebrow--dark">What we do</span>
              <h2 id="uba-act-title">Work with the community</h2>
            </header>
            <div className="uba-activities">
              {activities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.title}>
                    <span className="uba-activities__no">0{index + 1}</span>
                    <span className="uba-activities__icon"><Icon aria-hidden="true" /></span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="uba-block" aria-labelledby="uba-steps-title">
            <header className="uba-head">
              <span className="uba-eyebrow uba-eyebrow--dark">For students</span>
              <h2 id="uba-steps-title">How to take part</h2>
            </header>
            <ol className="uba-steps">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <span className="uba-steps__no">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="uba-villages" aria-labelledby="uba-vil-title">
            <span className="uba-villages__icon"><FiUsers aria-hidden="true" /></span>
            <div>
              <h2 id="uba-vil-title">Villages and activities</h2>
              <p>The villages adopted so far, with photographs and activity reports, will be listed here.</p>
            </div>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="uba-side" aria-labelledby="uba-dl-title">
          <h2 id="uba-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="uba-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="uba-side__label">{item.label}</span>
                  <span className="uba-side__type">{item.type}</span>
                  <FiDownload className="uba-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
