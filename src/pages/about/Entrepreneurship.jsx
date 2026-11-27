// Entrepreneurship.jsx - About us > Entrepreneurship (route: /about/entrepreneurship).
// This page has its own hero, its own styles (entrepreneurship.css, every class starts with "ent-") and its own downloads sidebar.
// Almost everything here is SAMPLE text - replace it with real content from the admin.
// The four programme cards link to the Students menu pages that already exist in the navbar.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight, FiFileText, FiDownload, FiZap, FiLayers, FiCode, FiUserCheck, FiArrowRight, FiStar,
} from "react-icons/fi";
import "./Entrepreneurship.css";
import { useAboutPage, mergeAboutContent } from "../../services/aboutUsService";
import PageLoader from "../../components/PageLoader";
import { mediaUrl } from "../../services/mediaService";

const defaultHero = { image: "/images/campus-3.jpg" };

const defaultIntro = {
  eyebrow: "About us",
  title: "Entrepreneurship",
  lead: "Turning ideas from the classroom and workshop into skills, small ventures and real work.", // SAMPLE
};

const defaultWelcome = "Our students learn to make things - and some go on to build their own work. The institute backs that spirit with an incubator, freelancing practice, skill courses and apprenticeships."; // SAMPLE

const defaultProgrammes = [
  { icon: FiZap, title: "Incubator", text: "A space for students to turn project ideas into working prototypes.", to: "/students/incubator" },
  { icon: FiCode, title: "Freelancing", text: "Learn to find and complete paid project work while still studying.", to: "/students/freelancing" },
  { icon: FiLayers, title: "Skill courses", text: "Short courses that add job-ready and business-ready skills.", to: "/students/skill-courses" },
  { icon: FiUserCheck, title: "Apprenticeship", text: "Learn on the job with industry partners.", to: "/students/apprenticeship" },
];

const defaultJourney = [
  { title: "Spark an idea", text: "Start with a problem you see in class, workshop or village." },
  { title: "Build a prototype", text: "Use the labs and workshop to make a first working version." },
  { title: "Get feedback", text: "Show it to teachers and industry guests and improve it." },
  { title: "Launch small", text: "Take it to your first users, customers or competitions." },
];

// SAMPLE file: the incubator guide does not exist yet. Put the real file in public/docs or remove this item.
const downloads = [
  { label: "Incubator guidelines", href: "/docs/incubator-guidelines.pdf", type: "PDF" },
];

export default function Entrepreneurship() {
  const { ready, content: savedContent } = useAboutPage("entrepreneurship");
  const hero = mergeAboutContent(defaultHero, savedContent?.hero);
  const intro = mergeAboutContent(defaultIntro, savedContent?.intro);
  const welcome = mergeAboutContent(defaultWelcome, savedContent?.welcome);
  const programmes = mergeAboutContent(defaultProgrammes, savedContent?.programmes);
  const journey = mergeAboutContent(defaultJourney, savedContent?.journey);

  if (!ready) return <main id="main" className="ent-page"><PageLoader /></main>;

  return (
    <main id="main" className="ent-page">
      {/* ---- hero ---- */}
      <section className="ent-hero" aria-label="Entrepreneurship" style={{ "--img": `url("${mediaUrl(hero.image)}")` }}>
        <div className="ent-hero__photo" />
        <div className="ent-hero__tags">
          <span className="ent-hero__tag ent-hero__tag--left">
            <span className="ent-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="ent-hero__tag ent-hero__tag--right">
            <span className="ent-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="ent-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Entrepreneurship</span>
        </nav>
      </section>

      <div className="container ent-layout">
        <div className="ent-content">
          {/* ---- title (level with the downloads card) ---- */}
          <header className="ent-intro">
            <span className="ent-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <p className="ent-welcome">{welcome}</p>

          <section className="ent-block" aria-labelledby="ent-prog-title">
            <header className="ent-head">
              <span className="ent-eyebrow ent-eyebrow--dark">Programmes</span>
              <h2 id="ent-prog-title">Ways to start building</h2>
            </header>
            <div className="ent-programmes">
              {programmes.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} to={item.to} className="ent-programme">
                    <span className="ent-programme__icon"><Icon aria-hidden="true" /></span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <span className="ent-programme__go">Learn more <FiArrowRight aria-hidden="true" /></span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="ent-block" aria-labelledby="ent-journey-title">
            <header className="ent-head">
              <span className="ent-eyebrow ent-eyebrow--dark">The journey</span>
              <h2 id="ent-journey-title">From idea to first customer</h2>
            </header>
            <ol className="ent-journey">
              {journey.map((step, index) => (
                <li key={step.title}>
                  <span className="ent-journey__no">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="ent-stories" aria-labelledby="ent-story-title">
            <span className="ent-stories__icon"><FiStar aria-hidden="true" /></span>
            <div>
              <h2 id="ent-story-title">Student success stories</h2>
              <p>Stories of students and alumni who started their own ventures will appear here.</p>
            </div>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="ent-side" aria-labelledby="ent-dl-title">
          <h2 id="ent-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="ent-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="ent-side__label">{item.label}</span>
                  <span className="ent-side__type">{item.type}</span>
                  <FiDownload className="ent-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
