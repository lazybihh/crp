// Apprenticeship.jsx - Students > Apprenticeship (route: /students/apprenticeship).
// Page order: hero -> title + "this session" card -> who can train -> training trades -> questions -> related -> help strip.
// Own hero, own styles (Apprenticeship.css, every class starts with "app-").
//
// WHAT IS REAL AND WHAT IS SAMPLE
//   REAL      everything about interns, ITI certificate holders and the trades comes from the live page
//             (crprohtak.ac.in/Apprenticeship): two interns this session (computer operation and programme application,
//             and electrical installation and management), both ITI certificate holders; training offered every year
//             in instrument repair, electrical installation and management, computer operation, plumbing, welding
//             and other skill-based technical work.
//   SAMPLE    only the last FAQ answer ("How do I ask about a place?") - the live page gives no application steps,
//             so it just points to the office. Replace it when the college has an application process.
//
// EACH YEAR: update `session` (the number and the interns' trades) at the top. Add or remove trades in the `trades` list.
//
// NO FILES TO COPY: this page uses no pictures except the shared banner (public/images/pages-banner.png).
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiArrowRight, FiAward, FiMonitor, FiZap, FiSettings, FiDroplet, FiTool,
  FiLayers, FiHelpCircle, FiPlus, FiPhone, FiMail,
} from "react-icons/fi";
import "./Apprenticeship.css";
import { useSite } from "../../context/SiteSettingsContext";

const hero = { image: "/images/pages-banner.png" }; // wide photo; if it is missing a patterned navy banner shows instead

const intro = {
  eyebrow: "Students",
  title: "Apprenticeship",
  lead: "Every year the institute offers hands-on training to ITI certificate holders in technical trades. Here is who it is for and what it covers.",
};

// The interns training this session (trade only - no names on a public page).
const session = {
  count: 2,
  interns: [
    { trade: "Computer operation and programme application", icon: FiMonitor },
    { trade: "Electrical installation and management", icon: FiZap },
  ],
};

// The trades the institute names on its live page. Add a line to add a trade.
const trades = [
  { name: "Instrument repair", icon: FiSettings },
  { name: "Electrical installation and management", icon: FiZap },
  { name: "Computer operation", icon: FiMonitor },
  { name: "Plumbing", icon: FiDroplet },
  { name: "Welding", icon: FiTool },
  { name: "Other skill-based technical work", icon: FiLayers },
];

const faqs = [
  { q: "Who can do an apprenticeship at the institute?", a: "ITI certificate holders. The institute offers training places to them every year." },
  { q: "Which trades are covered?", a: "Instrument repair, electrical installation and management, computer operation, plumbing, welding and other skill-based technical work." },
  { q: "How many interns are training now?", a: "Two this session: one in computer operation and programme application, and one in electrical installation and management. Both are ITI certificate holders." },
  { q: "How do I ask about a place?", a: "Call or write to the institute office. The contact details are at the bottom of this page." }, // SAMPLE
];

const related = [
  { label: "Skill courses", text: "Other practical programmes at the institute.", to: "/students/skill-courses" },
  { label: "Admissions", text: "Diploma programmes, seats and how to apply.", to: "/students/admissions" },
  { label: "Placements", text: "Where our students go after training.", to: "/about/placements" },
];

export default function Apprenticeship() {
  const { contact } = useSite();
  return (
    <main id="main" className="app-page">
      <section className="app-hero" aria-label="Apprenticeship" style={{ "--img": `url("${hero.image}")` }}>
        <div className="app-hero__photo" />
        <div className="app-hero__tags">
          <span className="app-hero__tag app-hero__tag--left">
            <span className="app-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="app-hero__tag app-hero__tag--right">
            <span className="app-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="app-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Apprenticeship</span>
        </nav>
      </section>

      <div className="container app-wrap">
        {/* ---- title + this-session card ---- */}
        <div className="app-top">
          <header className="app-intro">
            <span className="app-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
            <div className="app-intro__actions">
              <a className="app-btn app-btn--primary" href="#app-trades">
                See the trades
                <FiArrowRight aria-hidden="true" />
              </a>
              <a className="app-btn app-btn--line" href="#app-help">
                Ask the office
              </a>
            </div>
          </header>

          <aside className="app-glance" aria-label="Apprenticeship this session">
            <span className="app-glance__pill"><i aria-hidden="true" /> This session</span>
            <p className="app-glance__big">
              <strong>{session.count}</strong>
              interns in apprenticeship training
            </p>
            <ul className="app-glance__list">
              {session.interns.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.trade}>
                    <Icon aria-hidden="true" />
                    {item.trade}
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        {/* ---- who can train ---- */}
        <aside className="app-notice" aria-label="Who can train here">
          <span className="app-notice__icon"><FiAward aria-hidden="true" /></span>
          <div>
            <h2>Open to ITI certificate holders</h2>
            <p>The institute offers apprenticeship training places every year to people who hold an ITI certificate.</p>
          </div>
        </aside>

        {/* ---- trades ---- */}
        <section id="app-trades" className="app-block" aria-labelledby="app-trades-title">
          <header className="app-head">
            <span className="app-eyebrow app-eyebrow--line">Training trades</span>
            <h2 id="app-trades-title">Where you can <span>train</span></h2>
          </header>
          <ul className="app-trades">
            {trades.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <article className="app-trade">
                    <span className="app-trade__icon"><Icon aria-hidden="true" /></span>
                    <h3>{item.name}</h3>
                    <p>Training offered every year</p>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- questions ---- */}
        <section className="app-block" aria-labelledby="app-faq-title">
          <header className="app-head">
            <span className="app-eyebrow app-eyebrow--line">Questions</span>
            <h2 id="app-faq-title">Quick <span>answers</span></h2>
          </header>
          <div className="app-faq">
            {faqs.map((item) => (
              <details key={item.q} className="app-faq__item">
                <summary>
                  <span className="app-faq__q"><FiHelpCircle aria-hidden="true" />{item.q}</span>
                  <FiPlus className="app-faq__plus" aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---- related ---- */}
        <section className="app-related" aria-label="More for students">
          {related.map((item) => (
            <Link key={item.to} className="app-related__item" to={item.to}>
              <span>
                <strong>{item.label}</strong>
                {item.text}
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>

        {/* ---- help strip ---- */}
        <section id="app-help" className="app-help" aria-labelledby="app-help-title">
          <div>
            <h2 id="app-help-title">Want to ask about an apprenticeship?</h2>
            <p>The institute office can tell you about places and trades.</p>
          </div>
          <div className="app-help__actions">
            <a className="app-btn app-btn--primary" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
              <FiPhone aria-hidden="true" />
              {contact.phones.join(" / ")}
            </a>
            <a className="app-btn app-btn--ghost" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}