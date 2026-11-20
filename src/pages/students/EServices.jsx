// EServices.jsx - Students > E-services (route: /students/e-services).
// Page order: hero -> title + navy "at a glance" card -> three service cards -> good to know -> related -> help strip.
// Own hero, own styles (EServices.css, every class starts with "esv-").
//
// WHAT IS REAL AND WHAT IS ASSUMED
//   REAL     the three service names: Online Fees Facility, Digital library, E-Contents (the live page,
//            crprohtak.ac.in/e-services-for-Student, is a table of three names with no links and no text).
//   ASSUMED  every link below - the live page gives none. They are the most likely destinations; the college must confirm them:
//              Online Fees Facility -> SBI Collect (the site header's "online payment" button goes there)
//              Digital library      -> National Digital Library of India (also on /students/online-learning)
//              E-Contents           -> HSBTE digital e-learning (also on /students/online-learning)
//   SAMPLE   the one-line description under each service, and the "good to know" tips. They are general, not institute rules.
//            No fee amounts, dates or steps are shown, because the live site gives none.
//
// EDITING: `services` is the list to edit. A service with `href: ""` shows a "Link coming soon" label instead of a dead link.
//
// NO FILES TO COPY: this page uses no pictures except the shared banner (public/images/pages-banner.png).
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiArrowRight, FiPhone, FiMail, FiCreditCard, FiBook, FiLayers,
  FiExternalLink, FiClock, FiCheck, FiShield,
} from "react-icons/fi";
import "./EServices.css";
import { useSite } from "../../context/SiteSettingsContext";

const hero = { image: "/images/pages-banner.png" }; // wide photo; if it is missing a patterned navy banner shows instead

const intro = {
  eyebrow: "Students",
  title: "E-services",
  lead: "The institute's online services for students, all in one place. Pick a service and it opens in a new tab.",
};

// The three REAL services. Links are ASSUMED (see the top of this file). `site` is the short name shown on the card.
const services = [
  {
    icon: FiCreditCard,
    title: "Online Fees Facility",
    text: "Pay your fees online through the bank's payment portal.", // SAMPLE
    site: "SBI Collect",
    label: "Go to fee payment",
    href: "https://www.onlinesbi.sbi/sbicollect/icollecthome.htm",
  },
  {
    icon: FiBook,
    title: "Digital library",
    text: "Read books, journals and study material online.", // SAMPLE
    site: "National Digital Library of India",
    label: "Open the digital library",
    href: "https://ndl.iitkgp.ac.in/",
  },
  {
    icon: FiLayers,
    title: "E-Contents",
    text: "Digital lessons and learning material for polytechnic students.", // SAMPLE
    site: "HSBTE digital e-learning",
    label: "Open e-contents",
    href: "",
  },
];

// SAMPLE - general advice for any online service.
const goodToKnow = [
  { icon: FiShield, text: "Check the web address before you enter any payment or login details." },
  { icon: FiClock, text: "Keep a copy of every receipt or confirmation you get." },
  { icon: FiCheck, text: "If a link does not work, ask the institute office." },
];

const related = [
  { label: "Online learning", text: "More free portals and courses.", to: "/students/online-learning" },
  { label: "Student helpline", text: "Call or write to the office.", to: "/students/helpline" },
  { label: "Grievance redressal", text: "Raise a concern with the committee.", to: "/students/grievance" },
];

export default function EServices() {
  const { contact, links } = useSite();
  services.find((service) => service.title === "Online Fees Facility").href = links?.payFee || "";
  services.find((service) => service.title === "E-Contents").href = links?.hsbte ? `${links.hsbte.replace(/\/$/, "")}/digital-elearning` : "";
  const ready = services.filter((service) => service.href).length;

  return (
    <main id="main" className="esv-page">
      <section className="esv-hero" aria-label="E-services" style={{ "--img": `url("${hero.image}")` }}>
        <div className="esv-hero__photo" />
        <div className="esv-hero__tags">
          <span className="esv-hero__tag esv-hero__tag--left">
            <span className="esv-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="esv-hero__tag esv-hero__tag--right">
            <span className="esv-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="esv-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">E-services</span>
        </nav>
      </section>

      <div className="container esv-wrap">
        {/* ---- title + navy "at a glance" card ---- */}
        <div className="esv-top">
          <header className="esv-intro">
            <span className="esv-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <aside className="esv-glance" aria-labelledby="esv-glance-title">
            <p className="esv-glance__count">
              <strong>{services.length}</strong>
              online services
            </p>
            <h2 id="esv-glance-title" className="sr-only">Services at a glance</h2>
            <ul>
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <li key={service.title}>
                    <span className="esv-glance__icon"><Icon aria-hidden="true" /></span>
                    <span className="esv-glance__name">{service.title}</span>
                    <span className={`esv-glance__state${service.href ? "" : " esv-glance__state--soon"}`}>
                      {service.href ? "Open" : "Soon"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="esv-glance__note">{ready} of {services.length} links ready</p>
          </aside>
        </div>

        {/* ---- the three services (same size) ---- */}
        <section className="esv-block" aria-labelledby="esv-list-title">
          <header className="esv-head">
            <span className="esv-eyebrow esv-eyebrow--line">Choose a service</span>
            <h2 id="esv-list-title">Online <span>services</span></h2>
          </header>
          <ul className="esv-grid">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <li key={service.title} className="esv-card">
                  <span className="esv-card__no" aria-hidden="true">0{index + 1}</span>
                  <span className="esv-card__icon"><Icon aria-hidden="true" /></span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  {service.href ? (
                    <>
                      <span className="esv-card__site">{service.site}</span>
                      <a className="esv-btn esv-btn--primary" href={service.href} target="_blank" rel="noopener noreferrer">
                        {service.label}
                        <FiExternalLink aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </>
                  ) : (
                    <span className="esv-card__soon">
                      <FiClock aria-hidden="true" />
                      Link coming soon
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- good to know (SAMPLE, general) ---- */}
        <aside className="esv-know" aria-labelledby="esv-know-title">
          <h2 id="esv-know-title">Good to know</h2>
          <ul>
            {goodToKnow.map((tip) => {
              const Icon = tip.icon;
              return (
                <li key={tip.text}>
                  <span className="esv-know__icon"><Icon aria-hidden="true" /></span>
                  {tip.text}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ---- related ---- */}
        <section className="esv-related" aria-label="More for students">
          {related.map((item) => (
            <Link key={item.to} className="esv-related__item" to={item.to}>
              <span>
                <strong>{item.label}</strong>
                {item.text}
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>

        {/* ---- help strip ---- */}
        <section className="esv-help" aria-labelledby="esv-help-title">
          <div>
            <h2 id="esv-help-title">A service is not working?</h2>
            <p>Tell the institute office which service and what happened, and they will help.</p>
          </div>
          <div className="esv-help__actions">
            <a className="esv-btn esv-btn--primary" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
              <FiPhone aria-hidden="true" />
              {contact.phones.join(" / ")}
            </a>
            <a className="esv-btn esv-btn--ghost" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}