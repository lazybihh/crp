// StudentHelpline.jsx - Students > Student helpline (route: /students/helpline).
// Page order: hero -> title + navy "call the office" card -> three ways to reach us -> before you call -> other help -> notice.
// Own hero, own styles (StudentHelpline.css, every class starts with "hlp-").
// Content comes from the database; the lists below are the fallback and seed.
//
// WHAT IS REAL AND WHAT IS SAMPLE
//   REAL     the two phone numbers, the email and the address. They match the Navbar and Footer.
//   SAMPLE   the three "before you call" tips. They are general good practice, NOT a rule of the institute.
//            There are no office hours on this page - add them to `notice` when the college decides.
//
// EDITING: `contact` holds the details; `reach` and `tips` are plain lists; `other` links to the other Support pages.
//   Code of conduct PDF: public/docs/code-of-conduct-for-students.pdf
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiArrowRight, FiPhone, FiMail, FiHome, FiUser, FiBookOpen, FiEdit3,
  FiInfo, FiExternalLink, FiHeadphones,
} from "react-icons/fi";
import PageLoader from "../../components/PageLoader";
import { useStudentPage, mergeStudentContent } from "../../services/studentPageService";
import { mediaUrl } from "../../services/mediaService";
import "./StudentHelpline.css";
import { useSite } from "../../context/SiteSettingsContext";

const defaultHero = { image: "/images/campus-workshop.jpg" }; // wide photo; if it is missing a patterned navy banner shows instead

const defaultIntro = {
  eyebrow: "Students",
  title: "Student helpline",
  lead: "Need help or have a question? Call or write to the institute office. This page lists every way to reach us.",
};

// REAL - same details as the Navbar and Footer.
// Three same-size cards. `kind` decides what the card shows (phones, email or address).
const defaultReach = [
  { kind: "phone", icon: FiPhone, title: "Call the office", text: "Speak to the institute office on either number." },
  { kind: "email", icon: FiMail, title: "Write to us", text: "Send your question by email and keep a copy for yourself." },
  { kind: "address", icon: FiHome, title: "Visit the institute", text: "Come to the main office during a working day." },
];

// SAMPLE - general tips for any call or email. Not a rule of the institute.
const defaultTips = [
  { icon: FiUser, title: "Say who you are", text: "Give your name, branch and year at the start." },
  { icon: FiBookOpen, title: "Keep details ready", text: "Have your roll number or admission details at hand." },
  { icon: FiEdit3, title: "Be clear", text: "Say in one or two lines what help you need." },
];

const defaultNotice = {
  title: "Office hours are not published yet",
  text: "The institute has not listed calling hours on its website. If nobody answers, try the other number or send an email.",
};

const defaultOther = [
  { label: "Grievance redressal", text: "Raise a concern with the committee.", to: "/students/grievance" },
  { label: "E-services", text: "Fees, digital library and e-contents.", to: "/students/e-services" },
  { label: "Code of conduct", text: "Read the code for students (PDF).", href: "/docs/code-of-conduct-for-students.pdf" },
];

// Saved paths that start with /uploads/ become full backend addresses; everything else is left as it is.
function resolveStudentMedia(value) {
  if (Array.isArray(value)) return value.map(resolveStudentMedia);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveStudentMedia(item)]));
  }
  if (typeof value === "string" && value.startsWith("/uploads/")) return mediaUrl(value);
  return value;
}

export default function StudentHelpline() {
  const { ready, content: savedContent } = useStudentPage("helpline");
  const pageContent = resolveStudentMedia(
    mergeStudentContent(
      {
      hero: defaultHero,
      intro: defaultIntro,
      reach: defaultReach,
      tips: defaultTips,
      notice: defaultNotice,
      other: defaultOther,
      },
      savedContent
    )
  );
  const hero = pageContent.hero ?? defaultHero;
  const intro = pageContent.intro ?? defaultIntro;
  const reach = pageContent.reach ?? defaultReach;
  const tips = pageContent.tips ?? defaultTips;
  const notice = pageContent.notice ?? defaultNotice;
  const other = pageContent.other ?? defaultOther;

  const { contact: contactSettings } = useSite();
  const contact = {
    phones: contactSettings?.phones || [],
    email: contactSettings?.email || "",
    address: contactSettings?.addressLines || [],
  };
  if (!ready) return <main id="main" className="hlp-page"><PageLoader /></main>;

  return (
    <main id="main" className="hlp-page">
      <section className="hlp-hero" aria-label="Student helpline" style={{ "--img": `url("${hero.image}")` }}>
        <div className="hlp-hero__photo" />
        <div className="hlp-hero__tags">
          <span className="hlp-hero__tag hlp-hero__tag--left">
            <span className="hlp-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="hlp-hero__tag hlp-hero__tag--right">
            <span className="hlp-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="hlp-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Student helpline</span>
        </nav>
      </section>

      <div className="container hlp-wrap">
        {/* ---- title + navy call card ---- */}
        <div className="hlp-top">
          <header className="hlp-intro">
            <span className="hlp-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <aside className="hlp-call" aria-labelledby="hlp-call-title">
            <span className="hlp-call__icon"><FiHeadphones aria-hidden="true" /></span>
            <h2 id="hlp-call-title">Call the institute office</h2>
            <div className="hlp-call__numbers">
              {contact.phones.map((phone) => (
                <a key={phone} className="hlp-btn hlp-btn--primary" href={`tel:${phone.replace(/-/g, "")}`}>
                  <FiPhone aria-hidden="true" />
                  {phone}
                </a>
              ))}
            </div>
            <a className="hlp-call__mail" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
          </aside>
        </div>

        {/* ---- three ways to reach us ---- */}
        <section className="hlp-block" aria-labelledby="hlp-reach-title">
          <header className="hlp-head">
            <span className="hlp-eyebrow hlp-eyebrow--line">Get in touch</span>
            <h2 id="hlp-reach-title">Three ways to <span>reach us</span></h2>
          </header>
          <ul className="hlp-grid">
            {reach.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.kind} className="hlp-card">
                  <span className="hlp-card__icon"><Icon aria-hidden="true" /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="hlp-card__detail">
                    {item.kind === "phone" && contact.phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/-/g, "")}`}>{phone}</a>
                    ))}
                    {item.kind === "email" && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                    {item.kind === "address" && contact.address.map((line) => <span key={line}>{line}</span>)}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- before you call (SAMPLE, general) ---- */}
        <section className="hlp-tips" aria-labelledby="hlp-tips-title">
          <header>
            <span className="hlp-eyebrow hlp-eyebrow--light">A little preparation</span>
            <h2 id="hlp-tips-title">Before you call or write</h2>
          </header>
          <ol>
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <li key={tip.title}>
                  <span className="hlp-tips__icon"><Icon aria-hidden="true" /></span>
                  <span className="hlp-tips__text">
                    <strong>{tip.title}</strong>
                    {tip.text}
                  </span>
                  <span className="hlp-tips__no" aria-hidden="true">0{index + 1}</span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ---- notice ---- */}
        <aside className="hlp-notice" aria-label="Office hours">
          <span className="hlp-notice__icon"><FiInfo aria-hidden="true" /></span>
          <div>
            <h2>{notice.title}</h2>
            <p>{notice.text}</p>
          </div>
        </aside>

        {/* ---- other help ---- */}
        <section className="hlp-related" aria-label="Other help for students">
          {other.map((item) =>
            item.to ? (
              <Link key={item.label} className="hlp-related__item" to={item.to}>
                <span>
                  <strong>{item.label}</strong>
                  {item.text}
                </span>
                <FiArrowRight aria-hidden="true" />
              </Link>
            ) : (
              <a key={item.label} className="hlp-related__item" href={item.href} target="_blank" rel="noopener noreferrer">
                <span>
                  <strong>{item.label}</strong>
                  {item.text}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <FiExternalLink aria-hidden="true" />
              </a>
            ),
          )}
        </section>
      </div>
    </main>
  );
}